import { FC, ReactNode } from 'react'
import styled, { css } from 'styled-components'

export interface ButtonProps {
  onClick: () => void
  children: ReactNode
}

const _Button = styled.div(
  ({ theme }) => css`
    padding: 8px 12px;
    border: solid 1px ${theme.colors.neutral(200)};
    cursor: pointer;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    border-radius: ${theme.borderRadius};
    color: ${theme.colors.neutral(1000)};
    background-color: ${theme.colors.neutral(50)};
    font-family: ${theme.fontFamily.base};

    &:hover {
      background-color: ${theme.colors.neutral(100)};
    }

    &:active {
      background-color: ${theme.colors.neutral(200)};
    }
  `
)

export const Button: FC<ButtonProps> = ({ children, onClick }) => {
  return <_Button onClick={onClick}>{children}</_Button>
}
