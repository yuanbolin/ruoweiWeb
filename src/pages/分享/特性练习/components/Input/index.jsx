import React, { Component } from 'react'

export default function Input1(props) {
  return (
    <div>
      <span>{props.type == 'huashidu' ? '华氏度' : '摄氏度'}</span>
      <br />
      <input type='text' value={props.value} onChange={e => props.changeInput(e.target.value, props.type)} />
    </div>
  )
}
