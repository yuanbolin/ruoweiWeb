import React, { Component } from 'react'
import { Tag, Input, Tooltip, Icon, Form, Button, Modal, Divider } from 'antd'
import { get, post, put, del } from '@/utils/http'
import { error } from '@/utils/NotificationUtils'
import style from './Tags.less'
import styles from '@/pages/管理/index.less'

const { confirm } = Modal
export default class Tags extends React.Component {
  state = {
    tags: [],
    inputVisible: false,
    inputValue: '',
    editInputIndex: -1,
    editInputValue: ''
  }

  componentDidMount() {
    this.getTags()
  }

  getTags = () => {
    get(`wlt`).then(({ data }) => {
      let { data: list } = data
      let tags = []
      for (let i = 0; i < list.length; i++) {
        tags.push(list[i].name)
      }
      this.setState({
        tags
      })
    })
  }

  handleClose = removedTag => {
    confirm({
      content: <span>确认要删除该标签吗?</span>,
      onOk: () => {
        console.log('OK')
        del(`wlt/${removedTag}`).then(({ data }) => {
          const tags = this.state.tags.filter(tag => tag !== removedTag)
          this.setState({ tags })
        })
      },
      onCancel: () => {
        console.log('Cancel')
        this.setState({ tags: this.state.tags })
      }
    })
  }

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus())
  }

  handleInputChange = e => {
    this.setState({ inputValue: e.target.value })
  }

  handleInputConfirm = () => {
    let { inputValue } = this.state
    inputValue = inputValue.replace(/\s+/g, '')
    if (inputValue.length == 0) {
      this.setState({
        inputVisible: false,
        inputValue: ''
      })
      return
    }
    let { tags } = this.state
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue]
      post(`wlt`, { name: inputValue, msg: '' }).then(({ data }) => {
        this.setState({
          tags,
          inputVisible: false,
          inputValue: ''
        })
      })
    } else {
      error('重复的标签内容!')
    }
  }

  handleEditInputChange = e => {
    this.setState({ editInputValue: e.target.value })
  }

  handleEditInputConfirm = () => {
    let { tags, editInputIndex, editInputValue } = this.state
    editInputValue = editInputValue.replace(/\s+/g, '')
    if (editInputValue.length == 0) {
      error('标签内容不能为空!')
      return
    }
    const newTags = [...tags]
    put(`wlt`, { name: editInputValue, msg: '', oldName: newTags[editInputIndex] }).then(res => {
      newTags[editInputIndex] = editInputValue
      this.setState({
        tags: newTags,
        editInputIndex: -1,
        editInputValue: ''
      })
    })
  }

  saveInputRef = input => {
    this.input = input
  }

  saveEditInputRef = input => {
    this.editInput = input
  }

  render() {
    const { tags, inputVisible, inputValue, editInputIndex, editInputValue } = this.state
    return (
      <div className={styles.container}>
        <div className={styles.shadowBox}>
          <h3>工作类型标签管理</h3>
          <Divider />
          <div>
            {tags.map((tag, index) => {
              if (editInputIndex === index) {
                return (
                  <Input
                    ref={this.saveEditInputRef}
                    key={tag}
                    size='small'
                    style={{ width: '78px', marginRight: '8px', verticalAlign: 'top', marginTop: '5px' }}
                    value={editInputValue}
                    onChange={this.handleEditInputChange}
                    onBlur={this.handleEditInputConfirm}
                    onPressEnter={this.handleEditInputConfirm}
                  />
                )
              }

              const isLongTag = tag.length > 20

              const tagElem = (
                <Tag
                  className={style.editTag}
                  color='cyan'
                  key={tag}
                  closable
                  style={{ marginTop: '5px' }}
                  onClose={e => {
                    e.preventDefault()
                    this.handleClose(tag)
                  }}
                >
                  <span
                    style={{ display: 'inline-block', minWidth: '5px', minHeight: '14px', padding: '0 5px' }}
                    onDoubleClick={e => {
                      this.setState({ editInputIndex: index, editInputValue: tag }, () => {
                        this.editInput.focus()
                      })
                      e.preventDefault()
                    }}
                  >
                    {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                  </span>
                </Tag>
              )
              return isLongTag ? (
                <Tooltip title={tag} key={tag}>
                  {tagElem}
                </Tooltip>
              ) : (
                tagElem
              )
            })}
            {inputVisible && (
              <Input
                ref={this.saveInputRef}
                type='text'
                size='small'
                style={{ width: '78px', marginRight: '8px', verticalAlign: 'top' }}
                value={inputValue}
                onChange={this.handleInputChange}
                onBlur={this.handleInputConfirm}
                onPressEnter={this.handleInputConfirm}
              />
            )}
            {!inputVisible && (
              <Tag onClick={this.showInput} style={{ background: '#fff', borderStyle: 'dashed' }}>
                <Icon type='plus' /> New Tag
              </Tag>
            )}
          </div>
        </div>
      </div>
    )
  }
}
