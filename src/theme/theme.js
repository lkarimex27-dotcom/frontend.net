import { createTheme } from '@mui/material/styles';

// Paleta: verde botica (estable, "tienda de confianza") + ámbar como acento de acción.
// Tipografía: Space Grotesk para títulos (carácter, geométrica), Inter para texto/datos.
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1F4B43', // verde botica oscuro
      light: '#3C6F64',
      dark: '#143229',
      contrastText: '#FBF7EF',
    },
    secondary: {
      main: '#E1A33C', // ámbar, color de acción/alertas suaves
      contrastText: '#1F1B12',
    },
    background: {
      default: '#F6F3EC', // papel cálido, no blanco puro
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1C231F',
      secondary: '#5B655F',
    },
    divider: '#E3DDCC',
    error: { main: '#B23A2E' },
    success: { main: '#2E7D5B' },
  },
  shape: {
    borderRadius: 10,
  },
  typography: {
    fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
    h1: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700 },
    h2: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700 },
    h3: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: 600 },
    h4: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: 600 },
    h5: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: 600 },
    h6: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: 600, letterSpacing: 0.2 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1F4B43',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8 },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-root': {
            fontWeight: 700,
            fontFamily: '"Space Grotesk", sans-serif',
            backgroundColor: '#EFE9D8',
            color: '#1C231F',
          },
        },
      },
    },
  },
});

export default theme;
