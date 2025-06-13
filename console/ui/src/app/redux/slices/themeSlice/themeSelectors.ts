import { RootState } from '@app/redux/store/store';
 
export const selectThemeMode = (state: RootState) => state.theme.mode;
export const selectActualTheme = (state: RootState) => state.theme.actualTheme; 