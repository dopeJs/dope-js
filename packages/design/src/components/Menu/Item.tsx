import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { styled, css } from '../../styled'
import { List } from './List'
import { IMenuItemProps } from './types'

const StyledItem = styled.div<{ isActive: boolean; depth: number }>(
  ({ isActive, depth, theme }) => css`
    padding: 0 calc(1rem - 2px) 0 calc(${depth}rem - 2px);
    margin: 2px 0;
    min-height: 32px;
    display: flex;
    align-items: center;
    cursor: pointer;
    color: ${theme.neutral(800)};
    font-weight: ${theme.semiBold};

    ${isActive &&
    css`
      color: ${theme.primary(500)};
      background-color: ${theme.neutral(200)};
    `}

    &:hover {
      background-color: ${theme.neutral(200)};
    }
  `
)

export const Item: FC<IMenuItemProps> = ({
  title,
  itemKey,
  children,
  onItemClick,
  activeKey,
  depth,
  showIcon = false,
}) => {
  const isActive = useMemo(() => activeKey === itemKey, [activeKey, itemKey])
  const isDir = useMemo(() => Array.isArray(children), [children])
  const [fold, setFold] = useState(false)

  useEffect(() => {
    if (activeKey.startsWith(itemKey)) setFold(false)
  }, [itemKey, activeKey])

  const onClick = useCallback(() => {
    if (isDir) {
      setFold(!fold)
    } else {
      onItemClick(itemKey)
    }
  }, [itemKey, isDir, fold])

  return (
    <>
      <StyledItem isActive={isActive} depth={depth} onClick={onClick}>
        {title}
      </StyledItem>
      {!fold && Array.isArray(children) && children.length > 0 && (
        <List data={children} activeKey={activeKey} onItemClick={onItemClick} depth={depth + 1} showIcon={showIcon} />
      )}
    </>
  )
}
