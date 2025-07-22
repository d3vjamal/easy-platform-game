import React from 'react';
import { Box, Typography, Button, Grid, Avatar } from '@mui/material';
import { Upload } from 'lucide-react';

interface IconPickerProps {
    t: (key: string) => string;
    selectedIcon: string | null;
    setSelectedIcon: (icon: string | null) => void;
}

const PREDEFINED_ICONS = [
    '/icons/wifi.svg',
    '/icons/whatsapp.svg',
    '/icons/phone.svg',
    '/icons/email.svg',
    '/icons/link.svg',
];

const IconPicker: React.FC<IconPickerProps> = ({ t, selectedIcon, setSelectedIcon }) => {
    const handleIconClick = (icon: string) => {
        setSelectedIcon(icon === selectedIcon ? null : icon);
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedIcon(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                {t('iconPickerTitle')}
            </Typography>
            <Grid container spacing={2}>
                {PREDEFINED_ICONS.map((icon) => (
                    <Grid item key={icon}>
                        <Avatar
                            src={icon}
                            sx={{
                                cursor: 'pointer',
                                border: selectedIcon === icon ? '2px solid #00a5f1' : '2px solid transparent',
                            }}
                            onClick={() => handleIconClick(icon)}
                        />
                    </Grid>
                ))}
                <Grid item>
                    <Button
                        variant="outlined"
                        component="label"
                        startIcon={<Upload />}
                    >
                        {t('upload Icon')}
                        <input type="file" hidden onChange={handleFileUpload} accept="image/*" />
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default IconPicker;