const code = 'def50200fb96ad246d017ea6c2fd7e473d687038d805690671f0c38d915b73b07b55737a7ef48d3308453e156418ec2c758c1ac3aeebaf002a2622dc341b375317494ccc7895bde5e29b766404d0ffce860ec1f227ca04197dd336bbda49540ccae32bdef7c936eb83ae38cb729a37c76838e4a531932d88e411d53f9a33a08f4a17fbb4c7a51ad3e23aaa17bcb4f4c138281c915c7930f170b46082e48c9489aef42ee9d27c576a3f6f9bcd1038ddda33aede42d0c40a841ca9b7ca4ed0da9fceccf2e512d18390919655d8a5d194e3a5e09a3d5578d48b96c9da432bf78f7a776ebfcfc3f46e8a39c77795e752180d6aeadd973c8cb6f530b720efcb1d78e078d3516ce9abfddebd4a684d011e1fecb4a6af0740a391a932a11dd06d38d80671cc9cbc85a53c9de02bc46dcc72ebce258541b1340892583dfc6d0e4d4349ba63df6d91f4f773ff1a17699f5d7a462db0b70445566f55300b54454b555353ac89d94a5ae3ada9127f0b4b3325db0e070733e7470c58ae4e8b30c9896f4711bcf9286e198dc523dcb64e434d856a832b9ec4743b47ef8fececedb2e143e41e3545ecfd88bb43e9d8cff3ea4805d66ee7c0b93c54effbc510ec3826d2bcf47dc67642d165531e89d48966812dbd822d59e1045addc3c5be96aa2ce97c1ea2d887fe326b9de97e3383eefd61fcca999e0853ffd81fc1501a6739447d1339aa231ed10c120c6706346e87977309564a4f3dfca755c904c0396abfe70ba9b04d54db0ac66606a39aae7b082bcce749c2dcfc27b7573db374b025004fd004bb6dab';
const redirectUri = 'https://gpt-agent-kwid-43ii46hai-world-wide-services-62780b79.vercel.app/integrations/kommo/oauth/callback';

fetch('https://worldwideservices.kommo.com/oauth2/access_token', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  body: new URLSearchParams({
    client_id: '2a5c1463-43dd-4ccc-abd0-79516f785e57',
    client_secret: '6FhlKjCZehELKIShuUQcPHdrF9uUHKLQosf0tDsSvdTuUoahVz3EO44xzVinlbh7',
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: redirectUri,
  }),
})
.then(res => {
  console.log('Статус:', res.status);
  console.log('Заголовки:', Object.fromEntries(res.headers));
  return res.text();
})
.then(text => {
  console.log('Ответ:', text.substring(0, 500));
  try {
    const tokens = JSON.parse(text);
    console.log('✅ ТОКЕНЫ ПОЛУЧЕНЫ:');
    console.log('Access Token:', tokens.access_token);
    console.log('Refresh Token:', tokens.refresh_token);
    console.log('');
    console.log('📝 ДОБАВИТЬ В .env.local:');
    console.log('KOMMO_TEST_ACCESS_TOKEN=' + tokens.access_token);
    console.log('KOMMO_TEST_REFRESH_TOKEN=' + tokens.refresh_token);
  } catch (e) {
    console.error('❌ Не JSON ответ:', e.message);
  }
})
.catch(err => {
  console.error('❌ ОШИБКА:', err);
});
