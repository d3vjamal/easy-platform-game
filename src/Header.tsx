import React from 'react';
import { Box, Select, MenuItem, Typography } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import logo from './assets/apple-touch-icon.png';

interface HeaderProps {
    locale: string;
    setLocale: (locale: string) => void;
    t: (key: string) => string;
}

const Header: React.FC<HeaderProps> = ({ locale, setLocale, t }) => {
    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: { xs: 1, sm: 2 },
            background: 'transparent',
            color: 'black',
        }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <img
                    src={logo}
                    alt="Logo"
                    style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                />
                <Typography variant="h6" component="div" sx={{
                    flexGrow: 1,
                    fontSize: { xs: '1rem', sm: '1.25rem' }
                }}>
                    {t('appHeader')}
                </Typography>
            </Box>
            <Select
                value={locale}
                onChange={(e: SelectChangeEvent) => setLocale(e.target.value)}
                variant="outlined"
                size="small"
                sx={{
                    bgcolor: 'white',
                    color: 'black',
                    borderRadius: '20px',
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    '.MuiSelect-select': {
                        py: { xs: 0.5, sm: 1 },
                        px: { xs: 1, sm: 2 }
                    }
                }}
            >
                <MenuItem value="en-US">English</MenuItem>
                <MenuItem value="bn-BD">বাংলা</MenuItem>
            </Select>
        </Box>
    );
};

export default Header;