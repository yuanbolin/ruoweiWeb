import React from 'react'
import withBreadcrumbs from 'react-router-breadcrumbs-hoc'
import { NavLink } from 'umi'
import routes from '../../config/router.config'

const Breadcrumbs = withBreadcrumbs(routes)(data => {
  return (
    <div style={{ height: 45, lineHeight: '45px', paddingLeft: 30 }}>
      {data.breadcrumbs.map((item, index) => {
        if (item.match.url === '/admin') return null
        if (item.name === '404' && index < data.breadcrumbs.length - 1) return null
        const color = index === data.breadcrumbs.length - 1 ? 'rgba(0,0,0,0.65)' : 'rgba(0,0,0,0.45)'
        return (
          <span key={item.match.url}>
            {item.component ? (
              <NavLink style={{ color }} to={item.match.url}>
                {item.name}
              </NavLink>
            ) : (
              <span style={{ color: 'rgba(0,0,0,0.45)' }}>{item.name}</span>
            )}
            {item.component && item.bread && <span style={{ color: 'rgba(0,0,0,0.45)' }}>{item.bread}</span>}
            {item.name && index < data.breadcrumbs.length - 1 && <i>&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;</i>}
          </span>
        )
      })}
    </div>
  )
})

export default Breadcrumbs
