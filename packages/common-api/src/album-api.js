import {axios, albumApiUrl} from 'MyHttp'

/**
 * Created by johntostring on 17/6/16.
 */
export const getDirectoryList = (location) => {
  return axios.get(`${albumApiUrl}/album/directories?location=${location}`)
}
export const createDirectory = (params) => {
  return axios.post(`${albumApiUrl}/album/directories`, params)
}
