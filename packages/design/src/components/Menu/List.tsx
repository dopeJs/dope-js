import { styled } from '@/styled'
import { FC, useMemo } from 'react'
import { Item } from './Item'
import { IMenuListProps } from './types'

const StyledList = styled.div`
  display: flex;
  flex-direction: column;
`

export const List: FC<IMenuListProps> = ({ data, activeKey, onItemClick, showIcon, depth = 1 }) => {
  const displayList = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) return []
    return data.sort((a, b) => {
      const posA = a.position || Number.MAX_SAFE_INTEGER
      const posB = b.position || Number.MAX_SAFE_INTEGER

      if (posA < posB) return -1
      else if (posA > posB) return 1
      else if (a.title < b.title) return -1
      else if (a.title > b.title) return 1

      return 0
    })
  }, [data])

  return (
    <StyledList>
      {displayList.map((item) => (
        <Item
          activeKey={activeKey}
          key={item.itemKey}
          showIcon={showIcon}
          {...item}
          onItemClick={onItemClick}
          depth={depth}
        />
      ))}
    </StyledList>
  )
}
