import { DopePage } from '@dope-js/core';
import { Button, useDark } from '@dope-js/design';
import styled, { css } from 'styled-components';

const Wrapper = styled.div(
  ({ theme }) => css`
    background-color: ${theme.colors.carmine(200)};
  `
);

const Home: DopePage = () => {
  const { dark, setDark } = useDark();

  return (
    <Wrapper>
      <Button
        onClick={() => {
          console.log('index');
          setDark(!dark);
        }}
      >
        index
      </Button>
    </Wrapper>
  );
};

export default Home;
