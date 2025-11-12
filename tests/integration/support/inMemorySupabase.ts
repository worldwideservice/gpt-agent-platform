import { randomUUID } from 'node:crypto'

type TableRow = Record<string, any>

type FilterFn = (row: TableRow) => boolean

type OrderConfig = { column: string; ascending: boolean }

type ExecuteOptions = { limit?: number; range?: { from: number; to: number } }

const cloneRow = (row: TableRow): TableRow => JSON.parse(JSON.stringify(row))

export const cloneTables = (tables: Record<string, TableRow[]>): Record<string, TableRow[]> => {
  return Object.fromEntries(
    Object.entries(tables).map(([table, rows]) => [table, rows.map((row) => cloneRow(row))]),
  )
}

class QueryBuilder {
  private readonly table: TableRow[]
  private filters: FilterFn[] = []
  private orderings: OrderConfig[] = []
  private countRequested = false
  private headMode = false
  private insertedRows: TableRow[] | null = null
  private updatePayload: TableRow | null = null
  private deleteRequested = false

  constructor(table: TableRow[]) {
    this.table = table
  }

  select(_fields?: string, options?: { count?: 'exact'; head?: boolean }) {
    this.countRequested = options?.count === 'exact'
    this.headMode = Boolean(options?.head)
    return this
  }

  insert(payload: TableRow | TableRow[]) {
    const now = new Date().toISOString()
    const rows = (Array.isArray(payload) ? payload : [payload]).map((row, index) => ({
      id: row.id ?? randomUUID?.() ?? `row-${Date.now()}-${index}`,
      created_at: row.created_at ?? now,
      updated_at: row.updated_at ?? now,
      ...row,
    }))

    this.table.push(...rows)
    this.insertedRows = rows.map((row) => cloneRow(row))
    return this
  }

  update(payload: TableRow) {
    this.updatePayload = { ...payload }
    return this
  }

  delete() {
    this.deleteRequested = true
    return this
  }

  eq(column: string, value: unknown) {
    this.filters.push((row) => row[column] === value)
    return this
  }

  gte(column: string, value: unknown) {
    this.filters.push((row) => {
      const cell = row[column]
      if (cell === undefined || cell === null) return false
      return cell >= value
    })
    return this
  }

  in(column: string, values: unknown[]) {
    this.filters.push((row) => values.includes(row[column]))
    return this
  }

  order(column: string, options: { ascending: boolean }) {
    this.orderings.push({ column, ascending: options.ascending })
    return this
  }

  range(from: number, to: number) {
    const { data, count } = this.execute({ range: { from, to } })
    return Promise.resolve({ data, count, error: null })
  }

  limit(limit: number) {
    const { data } = this.execute({ limit })
    return Promise.resolve({ data, error: null })
  }

  maybeSingle() {
    const { data } = this.execute()
    return Promise.resolve({ data: data[0] ?? null, error: null })
  }

  single() {
    const { data } = this.execute()
    if (data.length === 0) {
      return Promise.resolve({ data: null, error: { message: 'not found' } })
    }
    return Promise.resolve({ data: data[0], error: null })
  }

  then<TResult1 = any, TResult2 = never>(
    onFulfilled?: ((value: { data: TableRow[] | null; count?: number | null; error: null }) => TResult1 | PromiseLike<TResult1>) | null,
    onRejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
  ) {
    try {
      const result = this.execute()
      if (onFulfilled) {
        return Promise.resolve(onFulfilled(result))
      }
      return Promise.resolve(result as unknown as TResult1)
    } catch (error) {
      if (onRejected) {
        return Promise.resolve(onRejected(error))
      }
      return Promise.reject(error)
    }
  }

  private execute(options?: ExecuteOptions): { data: TableRow[] | null; count?: number | null; error: null } {
    let workingSet = this.table.map((row) => row)

    if (this.filters.length > 0) {
      workingSet = workingSet.filter((row) => this.filters.every((predicate) => predicate(row)))
    }

    const matchedIds = new Set(workingSet.map((row) => row.id ?? row))

    if (this.deleteRequested) {
      const remaining = this.table.filter((row) => !matchedIds.has(row.id ?? row))
      this.table.length = 0
      this.table.push(...remaining)
      const count = this.countRequested ? workingSet.length : undefined
      this.reset()
      return { data: this.headMode ? null : [], count: count ?? null, error: null }
    }

    if (this.updatePayload) {
      const updatedRows: TableRow[] = []
      for (let index = 0; index < this.table.length; index += 1) {
        const current = this.table[index]
        const shouldUpdate = this.filters.length === 0 || this.filters.every((predicate) => predicate(current))
        if (shouldUpdate) {
          const updated = { ...current, ...this.updatePayload }
          this.table[index] = updated
          updatedRows.push(cloneRow(updated))
        }
      }
      workingSet = updatedRows
    }

    if (this.insertedRows) {
      workingSet = this.insertedRows.map((row) => cloneRow(row))
      this.insertedRows = null
    }

    if (this.orderings.length > 0) {
      workingSet = [...workingSet]
      this.orderings.forEach(({ column, ascending }) => {
        workingSet.sort((a, b) => {
          const aValue = a[column]
          const bValue = b[column]
          if (aValue === bValue) return 0
          if (aValue === undefined || aValue === null) return ascending ? 1 : -1
          if (bValue === undefined || bValue === null) return ascending ? -1 : 1
          return ascending
            ? String(aValue).localeCompare(String(bValue))
            : String(bValue).localeCompare(String(aValue))
        })
      })
    }

    const countValue = this.countRequested ? workingSet.length : undefined

    if (options?.range) {
      workingSet = workingSet.slice(options.range.from, options.range.to + 1)
    }

    if (options?.limit !== undefined) {
      workingSet = workingSet.slice(0, options.limit)
    }

    const data = this.headMode ? null : workingSet.map((row) => cloneRow(row))

    this.reset()
    return { data, count: countValue ?? null, error: null }
  }

  private reset() {
    this.filters = []
    this.orderings = []
    this.countRequested = false
    this.headMode = false
    this.updatePayload = null
    this.deleteRequested = false
  }
}

export const createInMemorySupabaseClient = (tables: Record<string, TableRow[]>) => {
  return {
    from: (tableName: string) => {
      if (!tables[tableName]) {
        tables[tableName] = []
      }
      return new QueryBuilder(tables[tableName])
    },
  }
}

export type InMemorySupabaseClient = ReturnType<typeof createInMemorySupabaseClient>
