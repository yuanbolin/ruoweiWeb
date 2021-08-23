import styles from './index.css'
import defaultSettings from '@/../config/defaultSettings'

export default function() {
  return (
    <div className={styles.normal}>
      <img src={defaultSettings.logo()} alt='' />
      <p className={styles.tit}>欢迎 {` ${sessionStorage.getItem('name') || '管理员大人'}`} ！</p>
      <p className={styles.cont}>介绍：若维脚手架工程项目</p>
    </div>
  )
}
