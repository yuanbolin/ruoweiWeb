import styles from './index.css'
import defaultSettings from '@/../config/defaultSettings'

export default function() {
  return (
    <div className={styles.normal}>
      <img src={defaultSettings.logo()} alt='' />
      <p className={styles.tit}>欢迎 {` ${sessionStorage.getItem('name') || '管理员大人'}`} ！</p>
      <p className={styles.cont}>事务型工作内容主要指上级安排的一切非项目任务清单内的工作，包括有计划目标的学习任务、会议、培训、项目前期客户沟通、整理报价清单、售后维护等
      </p>
    </div>
  )
}
