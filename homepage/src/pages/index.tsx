import { Button, css, useTheme, styled } from '@melon-js/design'
import { FC } from 'react'

const Wrapper = styled.div(
  ({ theme: { neutral } }) => css`
    background-color: ${neutral(500)};
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
