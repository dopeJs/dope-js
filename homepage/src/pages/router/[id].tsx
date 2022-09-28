import { DopePage } from '@dope-js/core'
import styled, { css } from 'styled-components'

const Text = styled.div(
  ({ theme }) => css`
    color: ${theme.colors.green(500)};
  `
)

const Test: DopePage<'id'> = ({ params: { id } }) => {
  return <Text>router: {id}</Text>
}

export default Test
