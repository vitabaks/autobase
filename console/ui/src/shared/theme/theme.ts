import { createTheme, PaletteMode } from '@mui/material';
import { blue } from '@mui/material/colors';
import { enUS } from '@mui/material/locale';

declare module '@mui/material/styles' {
  interface PaletteColor {
    lighter10?: string;
  }

  interface SimplePaletteColorOptions {
    lighter10?: string;
  }
}

export const createAppTheme = (mode: PaletteMode) => {
  const isLight = mode === 'light';
  
  return createTheme(
    {
      palette: {
        mode,
        primary: {
          main: '#3367D6',
          lighter10: '#0D8CE91A',
        },
        background: {
          default: isLight ? '#ffffff' : '#0a0a0a',
          paper: isLight ? '#ffffff' : '#1a1a1a',
        },
        text: {
          primary: isLight ? '#384555' : '#ffffff',
          secondary: isLight ? '#6B7280' : '#aaaaaa',
        },
        divider: isLight ? '#e1e5e9' : '#333333',
      },
      components: {
        MuiCssBaseline: {
          styleOverrides: {
            // Force all SVG icons to inherit theme colors globally
            'svg': {
              fill: `${isLight ? '#384555' : '#ffffff'} !important`,
              color: `${isLight ? '#384555' : '#ffffff'} !important`,
              '& path': {
                fill: `${isLight ? '#384555' : '#ffffff'} !important`,
              },
              '& circle': {
                fill: `${isLight ? '#384555' : '#ffffff'} !important`,
              },
              '& rect': {
                fill: `${isLight ? '#384555' : '#ffffff'} !important`,
              },
              '& polygon': {
                fill: `${isLight ? '#384555' : '#ffffff'} !important`,
              },
            },
            // Exception for brand logos that should keep their colors
            '[data-logo="true"] svg, .logo svg': {
              fill: 'unset !important',
              '& path': {
                fill: 'unset !important',
              },
            },
          },
        },
        MuiAppBar: {
          styleOverrides: {
            colorPrimary: {
              backgroundColor: isLight ? '#F6F8FA' : '#1a1a1a',
              borderBottomColor: isLight ? '#e1e5e9' : '#333333',
              color: isLight ? '#384555' : '#ffffff',
            },
          },
        },
        MuiDrawer: {
          styleOverrides: {
            paper: {
              backgroundColor: isLight ? '#ffffff' : '#1a1a1a',
              borderRightColor: isLight ? '#e1e5e9' : '#333333',
            },
          },
        },
        MuiTextField: {
          styleOverrides: {
            root: {
              '& .MuiOutlinedInput-root': {
                backgroundColor: isLight ? '#ffffff' : '#2a2a2a',
                '& fieldset': {
                  borderColor: isLight ? '#e1e5e9' : '#404040',
                },
                '&:hover fieldset': {
                  borderColor: isLight ? '#3367D6' : '#5A8DEE',
                },
                '& input': {
                  color: isLight ? '#384555' : '#ffffff',
                },
              },
              '& .MuiInputLabel-root': {
                color: isLight ? '#6B7280' : '#aaaaaa',
              },
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              backgroundColor: isLight ? '#ffffff' : '#1a1a1a',
              borderColor: isLight ? '#e1e5e9' : '#333333',
            },
          },
        },
        MuiMenu: {
          styleOverrides: {
            paper: {
              backgroundColor: isLight ? '#ffffff' : '#2a2a2a',
              border: `1px solid ${isLight ? '#e1e5e9' : '#404040'}`,
            },
          },
        },
                 MuiMenuItem: {
           styleOverrides: {
             root: {
               color: isLight ? '#384555' : '#ffffff',
               '&:hover': {
                 backgroundColor: isLight ? '#f5f5f5' : '#404040',
               },
               '&.Mui-selected': {
                 backgroundColor: isLight ? '#e3f2fd' : '#1e3a8a',
                 '&:hover': {
                   backgroundColor: isLight ? '#bbdefb' : '#1e40af',
                 },
               },
             },
           },
         },
         MuiListItemButton: {
           styleOverrides: {
             root: {
               color: isLight ? '#384555' : '#ffffff',
               '&:hover': {
                 backgroundColor: isLight ? '#f5f5f5' : '#2a2a2a',
               },
             },
           },
         },
         MuiListItemText: {
           styleOverrides: {
             primary: {
               color: isLight ? '#384555' : '#ffffff',
             },
           },
         },
         MuiListItemIcon: {
           styleOverrides: {
             root: {
               color: isLight ? '#384555' : '#ffffff',
               '& svg': {
                 fill: isLight ? '#384555' : '#ffffff !important',
                 '& path': {
                   fill: isLight ? '#384555' : '#ffffff !important',
                 },
               },
             },
           },
         },
         MuiIconButton: {
           styleOverrides: {
             root: {
               color: isLight ? '#384555' : '#ffffff',
               '&:hover': {
                 backgroundColor: isLight ? '#f5f5f5' : '#2a2a2a',
               },
               '& svg': {
                 fill: isLight ? '#384555' : '#ffffff',
               },
             },
           },
         },
         MuiTable: {
           styleOverrides: {
             root: {
               backgroundColor: isLight ? '#ffffff' : '#1a1a1a',
               '& .MuiTableHead-root': {
                 backgroundColor: isLight ? '#F6F8FA' : '#2a2a2a',
               },
               '& .MuiTableCell-root': {
                 borderBottomColor: isLight ? '#e1e5e9' : '#404040',
                 color: isLight ? '#384555' : '#ffffff',
               },
               '& .MuiTableCell-head': {
                 backgroundColor: isLight ? '#F6F8FA' : '#2a2a2a',
                 color: isLight ? '#384555' : '#ffffff',
                 fontWeight: 600,
               },
             },
           },
         },
         MuiTableContainer: {
           styleOverrides: {
             root: {
               backgroundColor: isLight ? '#ffffff' : '#1a1a1a',
               border: `1px solid ${isLight ? '#e1e5e9' : '#404040'}`,
               borderRadius: '8px',
             },
           },
         },
         MuiToolbar: {
           styleOverrides: {
             root: {
               backgroundColor: isLight ? '#ffffff' : '#1a1a1a',
               color: isLight ? '#384555' : '#ffffff',
             },
           },
         },
         MuiButton: {
           styleOverrides: {
             root: {
               textTransform: 'none',
             },
             outlined: {
               borderColor: isLight ? '#e1e5e9' : '#404040',
               color: isLight ? '#384555' : '#ffffff',
               '&:hover': {
                 borderColor: isLight ? '#3367D6' : '#5A8DEE',
                 backgroundColor: isLight ? '#f5f5f5' : '#2a2a2a',
               },
             },
           },
         },
         MuiChip: {
           styleOverrides: {
             root: {
               backgroundColor: isLight ? '#f5f5f5' : '#2a2a2a',
               color: isLight ? '#384555' : '#ffffff',
             },
           },
         },
         MuiTooltip: {
           styleOverrides: {
             tooltip: {
               backgroundColor: isLight ? '#333333' : '#ffffff',
               color: isLight ? '#ffffff' : '#333333',
             },
           },
         },
         MuiDialog: {
           styleOverrides: {
             paper: {
               backgroundColor: isLight ? '#ffffff' : '#1a1a1a',
               color: isLight ? '#384555' : '#ffffff',
             },
           },
         },
         MuiDialogTitle: {
           styleOverrides: {
             root: {
               color: isLight ? '#384555' : '#ffffff',
             },
           },
         },
         MuiDialogContent: {
           styleOverrides: {
             root: {
               color: isLight ? '#384555' : '#ffffff',
             },
           },
         },
      },
    },
    enUS,
  );
};

// Default light theme for backward compatibility
const theme = createAppTheme('light');

export default theme;
