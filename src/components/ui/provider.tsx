import { ChakraProvider, createSystem, defaultConfig } from "@chakra-ui/react";
import type { PropsWithChildren } from "react";
import { ColorModeProvider } from "./color-mode";

const system = createSystem(defaultConfig, {
  globalCss: {
    body: {
      colorPalette: "teal",
    },
  },
  theme: {
    tokens: {
      fonts: {
        body: { value: "var(--font-rubik)" },
        heading: { value: "var(--font-rubik)" },
        mono: { value: "var(--font-rubik)" },
      },
    },
  },
});

export const Provider = (props: PropsWithChildren) => (
  <ChakraProvider value={system}>
    <ColorModeProvider forcedTheme="light">{props.children}</ColorModeProvider>
  </ChakraProvider>
);
