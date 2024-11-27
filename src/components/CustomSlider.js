
import {
    Typography,
    Button,
    Box,
  } from '@mui/material';

const CustomSlider = ({ image, text, buttonText, buttonLink }) => {
    return (
      <Box sx={{ margin: 8 ,display: 'flex', alignItems: 'center', height: '500px' }}>
        {/* Image on the left side */}
        <Box sx={{ flex: 1 }}>
          <img
            src={image}
            alt="Landing Slide"
            style={{ width: '100%', height: '100%', objectFit: 'cover', marginTop: '100px' }}
          />
        </Box>
        
        {/* Text and Button on the right side */}
        <Box sx={{ 
          flex: 1, 
          padding: '20px', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', // Vertically center the content
          alignItems: 'flex-start' // Align items to the start (left side)
        }}>
          <Typography variant="h4" sx={{ marginBottom: '20px' }}>{text}</Typography>
          <Button 
            variant="contained" 
            sx={{ backgroundColor: '#000000', '&:hover': { backgroundColor: '#000000' } }} 
            href={buttonLink}
          >
            {buttonText}
          </Button>
        </Box>
      </Box>
    );
  };

  export default CustomSlider;