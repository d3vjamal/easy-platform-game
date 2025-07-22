import React from 'react';
import { Box, Typography, Slider, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

interface AppearanceSettingsProps {
    t: (key: string) => string;
    size: number;
    setSize: (size: number) => void;
    level: string;
    setLevel: (level: string) => void;
}

const AppearanceSettings: React.FC<AppearanceSettingsProps> = ({
    t,
    size,
    setSize,
    level,
    setLevel,
}) => {
    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                {t('appearanceSettingsTitle')}
            </Typography>
            <Typography gutterBottom>{t('size')}</Typography>
            <Slider
                value={size}
                onChange={(_, newValue) => setSize(newValue as number)}
                aria-labelledby="size-slider"
                valueLabelDisplay="auto"
                step={50}
                marks
                min={100}
                max={500}
            />
            <FormControl fullWidth margin="normal">
                <InputLabel>{t('errorCorrectionLevel')}</InputLabel>
                <Select
                    value={level}
                    label={t('errorCorrectionLevel')}
                    onChange={(e) => setLevel(e.target.value)}
                    sx={{ borderRadius: '19px' }}

                >
                    <MenuItem value="L">{t('levelL')}</MenuItem>
                    <MenuItem value="M">{t('levelM')}</MenuItem>
                    <MenuItem value="Q">{t('levelQ')}</MenuItem>
                    <MenuItem value="H">{t('levelH')}</MenuItem>
                </Select>
            </FormControl>
        </Box>
    );
};

export default AppearanceSettings;