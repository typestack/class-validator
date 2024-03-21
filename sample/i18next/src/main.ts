import inject from 'light-my-request'
import app from './server'
(async function () {
  const responseEnglish = await inject(app, {
    method: 'POST',
    url: '/urls/create',
    headers: {
      "content-type": "application/json"
    },
    payload: JSON.stringify({ query: {} })
  })
  console.log('responseEnglish: ', JSON.stringify(responseEnglish.json(), null, 2))
  const responseFrench = await inject(app, {
    method: 'POST',
    url: '/urls/create',
    headers: {
      "content-type": "application/json",
      "accept-language": "fr"
    },
    payload: JSON.stringify({ query: {} })
  })
  console.log('responseFrench: ', JSON.stringify(responseFrench.json(), null, 2))
})()