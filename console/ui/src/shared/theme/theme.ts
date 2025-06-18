import { createTheme, PaletteMode } from '@mui/material';
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
          lighter10: 'rgba(51, 103, 214, 0.1)',
        },
        background: {
          default: isLight ? '#ffffff' : '#121212',
          paper: isLight ? '#ffffff' : '#1a1a1a',
        },
        text: {
          primary: isLight ? '#384555' : '#dddddd',
          secondary: isLight ? '#4B5563' : '#aaaaaa',
        },
        divider: isLight ? '#e1e5e9' : '#2a2a2a',
      },
      components: {
        MuiCssBaseline: {
          styleOverrides: {
            // Remove heavy global transitions to avoid flash of white on theme load
            '*': {
              transition: 'color 0.15s ease-in-out, border-color 0.15s ease-in-out',
            },
            // Apply default icon color to MUI icons only, leaving custom SVGs untouched
            'svg.MuiSvgIcon-root': {
              fill: `${isLight ? '#384555' : '#dddddd'} !important`,
              color: `${isLight ? '#384555' : '#dddddd'} !important`,
              '& path, & circle, & rect, & polygon': {
                fill: `${isLight ? '#384555' : '#dddddd'} !important`,
              },
            },
            // Exception for brand logos that should keep their original colors
            '[data-logo="true"]': {
              fill: 'unset !important',
              color: 'unset !important',
              '& path, & circle, & rect, & polygon': {
                fill: '#FF5722 !important',
              },
            },
            // Fall-back for any element that uses a ".logo" class instead of the data attribute
            '.logo, .logo *': {
              fill: 'unset !important',
              color: 'unset !important',
            },
          },
        },
        MuiAppBar: {
          styleOverrides: {
            colorPrimary: {
              backgroundColor: isLight ? '#F6F8FA' : '#1a1a1a',
              borderBottomColor: isLight ? '#e1e5e9' : '#2a2a2a',
              color: isLight ? '#384555' : '#dddddd',
            },
          },
        },
        MuiDrawer: {
          styleOverrides: {
            paper: {
              backgroundColor: isLight ? '#ffffff' : '#1a1a1a',
              borderRightColor: isLight ? '#e1e5e9' : '#2a2a2a',
            },
          },
        },
        MuiTextField: {
          styleOverrides: {
            root: {
              '& .MuiOutlinedInput-root': {
                backgroundColor: isLight ? '#ffffff' : '#2a2a2a',
                borderRadius: '8px',
                transition: 'all 0.2s ease-in-out',
                '& fieldset': {
                  borderColor: isLight ? '#e1e5e9' : '#404040',
                },
                '&:hover fieldset': {
                  borderColor: isLight ? '#3367D6' : '#5A8DEE',
                },
                '&.Mui-focused fieldset': {
                  borderColor: isLight ? '#3367D6' : '#5A8DEE',
                  borderWidth: '2px',
                },
                '&.Mui-error fieldset': {
                  borderColor: isLight ? '#dc2626' : '#ef4444',
                },
                '&.Mui-error:hover fieldset': {
                  borderColor: isLight ? '#b91c1c' : '#dc2626',
                },
                '& input': {
                  color: isLight ? '#384555' : '#dddddd',
                },
              },
              '& .MuiInputLabel-root': {
                color: isLight ? '#4B5563' : '#aaaaaa',
                '&.Mui-focused': {
                  color: isLight ? '#3367D6' : '#5A8DEE',
                },
                '&.Mui-error': {
                  color: isLight ? '#dc2626' : '#ef4444',
                },
              },
              '& .MuiFormHelperText-root': {
                fontSize: '0.75rem',
                '&.Mui-error': {
                  color: isLight ? '#dc2626' : '#ef4444',
                },
              },
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              backgroundColor: isLight ? '#ffffff' : '#1a1a1a',
              borderColor: isLight ? '#e1e5e9' : '#2a2a2a',
              // Enhanced shadows for dark mode
              boxShadow: isLight 
                ? '0px 2px 6px rgba(0, 0, 0, 0.1)'
                : '0px 4px 16px rgba(0, 0, 0, 0.2), 0px 0px 0px 1px rgba(255, 255, 255, 0.05)',
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
               color: isLight ? '#384555' : '#dddddd',
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
               color: isLight ? '#384555' : '#dddddd',
               '&:hover': {
                 backgroundColor: isLight ? '#f5f5f5' : '#2a2a2a',
               },
             },
           },
         },
         MuiListItemText: {
           styleOverrides: {
             primary: {
               color: isLight ? '#384555' : '#dddddd',
             },
           },
         },
         MuiListItemIcon: {
           styleOverrides: {
             root: {
               color: isLight ? '#384555' : '#dddddd',
               '& svg': {
                 fill: isLight ? '#384555' : '#dddddd !important',
                 '& path': {
                   fill: isLight ? '#384555' : '#dddddd !important',
                 },
               },
             },
           },
         },
         MuiIconButton: {
           styleOverrides: {
             root: {
               color: isLight ? '#384555' : '#dddddd',
               '&:hover': {
                 backgroundColor: isLight ? '#f5f5f5' : '#2a2a2a',
               },
               '& svg': {
                 fill: isLight ? '#384555' : '#dddddd',
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
                 color: isLight ? '#384555' : '#dddddd',
               },
               '& .MuiTableCell-head': {
                 backgroundColor: isLight ? '#F6F8FA' : '#2a2a2a',
                 color: isLight ? '#384555' : '#dddddd',
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
               backgroundColor: isLight ? '#F6F8FA' : '#242526',
               color: isLight ? '#384555' : '#dddddd',
             },
           },
         },
         MuiButton: {
           styleOverrides: {
             root: {
               textTransform: 'none',
               // Enhanced focus states for accessibility
               '&:focus-visible': {
                 outline: `2px solid ${isLight ? '#3367D6' : '#5A8DEE'}`,
                 outlineOffset: '2px',
               },
             },
             outlined: {
               borderColor: isLight ? '#e1e5e9' : '#404040',
               color: isLight ? '#384555' : '#dddddd',
               '&:hover': {
                 borderColor: isLight ? '#3367D6' : '#5A8DEE',
                 backgroundColor: isLight ? '#f5f5f5' : '#2a2a2a',
               },
               '&:focus-visible': {
                 borderColor: isLight ? '#3367D6' : '#5A8DEE',
                 backgroundColor: isLight ? '#f8f9fa' : '#2d2d2d',
               },
             },
             contained: {
               '&:focus-visible': {
                 boxShadow: isLight 
                   ? '0 0 0 3px rgba(51, 103, 214, 0.3)' 
                   : '0 0 0 3px rgba(90, 141, 238, 0.4)',
               },
             },
           },
         },
         MuiChip: {
           styleOverrides: {
             root: {
               backgroundColor: isLight ? '#f5f5f5' : '#2a2a2a',
               color: isLight ? '#384555' : '#dddddd',
             },
           },
         },
         MuiTooltip: {
           styleOverrides: {
             tooltip: {
               backgroundColor: isLight ? '#2a2a2a' : '#ffffff',
               color: isLight ? '#ffffff' : '#2a2a2a',
             },
           },
         },
         MuiDialog: {
           styleOverrides: {
             paper: {
               backgroundColor: isLight ? '#ffffff' : '#1a1a1a',
               color: isLight ? '#384555' : '#dddddd',
             },
           },
         },
         MuiDialogTitle: {
           styleOverrides: {
             root: {
               color: isLight ? '#384555' : '#dddddd',
             },
           },
         },
         MuiDialogContent: {
           styleOverrides: {
             root: {
               color: isLight ? '#384555' : '#dddddd',
             },
           },
         },
         MuiLinearProgress: {
           styleOverrides: {
             root: {
               backgroundColor: isLight ? '#e1e5e9' : '#404040',
               '& .MuiLinearProgress-bar': {
                 backgroundColor: isLight ? '#3367D6' : '#5A8DEE',
               },
             },
           },
         },
         MuiSkeleton: {
           styleOverrides: {
             root: {
               backgroundColor: isLight ? '#f0f0f0' : '#2a2a2a',
               '&::after': {
                 background: isLight 
                   ? 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)'
                   : 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
               },
             },
           },
         },
         MuiAccordion: {
           styleOverrides: {
             root: {
               backgroundColor: isLight ? '#ffffff' : '#1a1a1a',
               border: `1px solid ${isLight ? '#e1e5e9' : '#2a2a2a'}`,
               borderRadius: '8px !important',
               boxShadow: isLight 
                 ? '0px 1px 3px rgba(0, 0, 0, 0.1)' 
                 : '0px 2px 8px rgba(0, 0, 0, 0.2)',
               '&:before': {
                 display: 'none',
               },
               '&.Mui-expanded': {
                 margin: '0',
               },
             },
           },
         },
         MuiAccordionSummary: {
           styleOverrides: {
             root: {
               backgroundColor: isLight ? '#f8f9fa' : '#222222',
               borderBottom: `1px solid ${isLight ? '#e1e5e9' : '#2a2a2a'}`,
               minHeight: '56px',
               '&.Mui-expanded': {
                 minHeight: '56px',
               },
               '& .MuiAccordionSummary-content': {
                 margin: '12px 0',
                 '&.Mui-expanded': {
                   margin: '12px 0',
                 },
               },
             },
           },
         },
         MuiAccordionDetails: {
           styleOverrides: {
             root: {
               backgroundColor: isLight ? '#ffffff' : '#1a1a1a',
               padding: '16px',
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
