import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { SketchPicker } from 'react-color';

interface ColorPickerProps {
    t: (key: string) => string;
    foregroundColor: string;
    setForegroundColor: (color: string) => void;
    backgroundColor: string;
    setBackgroundColor: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
    t,
    foregroundColor,
    setForegroundColor,
    backgroundColor,
    setBackgroundColor,
}) => {
    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                {t('colorPickerTitle')}
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <Typography gutterBottom>{t('foregroundColor')}</Typography>
                    <Box
                        sx={{
                            width: 'clamp(140px, 100%, 280px)',
                        }}
                    >
                        <SketchPicker
                            width="100%"
                            color={foregroundColor}
                            onChangeComplete={(color) => setForegroundColor(color.hex)}
                        />
                    </Box>
                </Grid>
                <Grid item xs={6}>
                    <Typography gutterBottom>{t('backgroundColor')}</Typography>
                    <Box
                        sx={{
                            width: 'clamp(140px, 100%, 280px)',
                        }}
                    >
                        <SketchPicker
                            width="100%"
                            color={backgroundColor}
                            onChangeComplete={(color) => setBackgroundColor(color.hex)}
                        />
                    </Box>
                </Grid>
            </Grid>
            <br></br>
        </Box>
    );
};

export default ColorPicker;