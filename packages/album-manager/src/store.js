import * as api from '../../common-api'
import Vue from 'vue'
import _ from 'lodash'

const RECEIVE_DIRECTORY_LIST = 'RECEIVE_DIRECTORY_LIST'

export default {
  state: {
    count: 0,
    directoryList: []
  },
  getters: {
    directoryList: state => {
      return state.directoryList
    }
  },
  actions: {
    getDirectoryList: ({commit}, parent) => {
      let location = parent.location + (parent.location.endsWith('/') ? '' : '/') + (parent.name || '')
      return api.getDirectoryList(location).then(res => {
        let model = res.data
        if (res.status === 200 || model.ok) {
          let list = model.body
          commit(RECEIVE_DIRECTORY_LIST, {parent, list})
        }
        return Promise.resolve(model)
      }).catch(error => {
        return Promise.reject(error)
      })
    },
    findDirectoryByLocation: ({getters}, location) => {
      let array = location.split('/')
      let dir = {children: getters.directoryList}
      array.forEach(name => {
        if (name !== '') {
          dir = _.find(dir.children, {name: name})
        }
      })
      return dir
    }
  },
  mutations: {
    RECEIVE_DIRECTORY_LIST (state, {parent, list}) {
      if (parent.location + (parent.name || '') === '/') {
        state.directoryList = list
      } else {
        Vue.set(parent, 'children', list)
      }
    }
  }
}
