import styled from "styled-components";

export const ShowcaseGrid = styled.div`
  display: grid;
  width: 100%;
  gap: ${({ theme }) => theme.space["6"]};
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  align-items: stretch;

  @media (min-width: 1024px) {
    gap: ${({ theme }) => theme.space["8"]};
  }

  @media (min-width: 1280px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;
