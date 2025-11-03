export const dynamic = "force-dynamic";

const PlatformPage = async () => {
 return (
 <div className="container mx-auto py-8 px-4">
 <div className="max-w-4xl mx-auto">
 <h1 className="text-3xl font-bold text-gray-900 mb-4">
 Добро пожаловать на платформу
 </h1>
 <p className="text-lg text-gray-600 mb-8">
 Здесь вы сможете управлять своими AI-агентами и интеграциями.
 </p>
 <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
 <p className="text-gray-500 text-center">
 Платформа готова к разработке. Начните создавать функционал с нуля.
 </p>
 </div>
 </div>
 </div>
 );
};

export default PlatformPage;