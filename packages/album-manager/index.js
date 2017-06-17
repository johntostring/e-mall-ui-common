import AlbumManager from './src/AlbumManager.vue'

/* istanbul ignore next */
AlbumManager.install = (Vue) => {
  Vue.component(AlbumManager.name, AlbumManager)
}

export default AlbumManager
