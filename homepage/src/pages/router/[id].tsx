import { DopePage } from '@dope-js/core'
import { css, styled } from '@dope-js/design'

const Text = styled.div(
  ({ theme: { green } }) => css`
    color: ${green(500)};
  `
)

const Test: DopePage<'id'> = ({ params: { id } }) => {
  return <Text>router: {id}</Text>
}

export default Test
