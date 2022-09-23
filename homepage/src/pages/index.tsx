import { Button, useTheme } from '@dope-js/design'
import { FC } from 'react'
import styled, { css } from 'styled-components'

const Wrapper = styled.div(
  ({ theme }) => css`
    background-color: ${theme.carmine(200)};
  `
)

const Home: FC = () => {
  const { dark, setDark } = useTheme()

  return (
    <Wrapper>
      <Button
        onClick={() => {
          console.log('index')
          setDark(!dark)
        }}
      >
        index
      </Button>
    </Wrapper>
  )
}

export default Home
