import { MelonPage } from '@melon-js/core'
import { css, styled } from '@melon-js/design'

const Text = styled.div(
  ({ theme: { green } }) => css`
    color: ${green(500)};
  `
)

const Test: MelonPage<'id'> = ({ params: { id } }) => {
  return <Text>router: {id}</Text>
}

export default Test
