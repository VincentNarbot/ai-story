/**
 * Parses the JSON returned by a network request
 *
 * @param  {object} response A response from a network request
 *
 * @return {object}          The parsed JSON from the request
 */
function parseJSON(response) {
  if (response.status === 204) {
    return null;
  }
  return response.json();
}

/**
 * Checks if a network request came back fine, and throws an error if not
 *
 * @param  {object} response   A response from a network request
 *
 * @return {object|undefined} Returns either the response, or throws an error
 */
const checkStatus = async (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  let payload = null;

  try {
    const data = await response.json();
    payload = data;
  } catch (e) {
    payload = response.statusText;
  }

  throw payload;
};

/**
 * Requests a URL, returning a promise
 * @return {object}           The response data
 */
export default function request(
  endpoint,
  options,
  api_url = process.env.NEXT_PUBLIC_API_URL
) {
  return fetch(`${api_url}${endpoint}`, options)
    .then(checkStatus)
    .then(parseJSON);
}
