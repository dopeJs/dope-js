import { css, styled } from '@/styled'
import { FC, ReactNode } from 'react'

export interface ButtonProps {
  onClick: () => void
  children: ReactNode
}

const _Button = styled.div(
  ({ theme: { neutral, borderRadius, fontFamilyBase } }) => css`
    padding: 8px 12px;
    border: solid 1px ${neutral(200)};
    cursor: pointer;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    border-radius: ${borderRadius};
    color: ${neutral(1000)};
    background-color: ${neutral(50)};
    font-family: ${fontFamilyBase};

    &:hover {
      background-color: ${neutral(100)};
    }

    &:active {
      background-color: ${neutral(200)};
    }
  `
)

export const Button: FC<ButtonProps> = ({ children, onClick }) => {
  return <_Button onClick={onClick}>{children}</_Button>
}
