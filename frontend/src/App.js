import React, { useState } from "react";
import { submitNewAsset, getImages, BLOB_ACCOUNT } from "./services/api";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Avatar,
  IconButton,
  Box,
  Alert,
  CardHeader
} from '@mui/material';
import {
  PhotoCamera,
  Favorite,
  Comment,
  Share
} from '@mui/icons-material';

function App() {
  const [fileName, setFileName] = useState("");
  const [userID, setUserID] = useState("");
  const [userName, setUserName] = useState("");
  const [file, setFile] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!fileName || !userID || !userName || !file) {
      setError("Please fill out all fields and select a file.");
      return;
    }

    try {
      setLoading(true);
      const fileData = { FileName: fileName, userID, userName, File: file };
      await submitNewAsset(fileData);
      alert("File uploaded successfully!");
      setFileName("");
      setUserID("");
      setUserName("");
      setFile(null);
      fetchImages();
    } catch (error) {
      console.error('Upload error:', error);
      setError("Failed to upload file. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchImages = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getImages();
      setImages(data);
    } catch (error) {
      console.error('Fetch error:', error);
      setError("Failed to fetch images. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      {/* Upload Form */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Share an Image
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="User Name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="User ID"
                value={userID}
                onChange={(e) => setUserID(e.target.value)}
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="File Name"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                component="label"
                startIcon={<PhotoCamera />}
                size="small"
              >
                Upload Image
                <input
                  type="file"
                  hidden
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </Button>
              {file && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Selected: {file.name}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12}>
              <Button
                fullWidth
                variant="contained"
                type="submit"
                disabled={loading}
                size="small"
              >
                {loading ? "Posting..." : "Post"}
              </Button>
            </Grid>
          </Grid>
        </Box>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Paper>

      {/* View Images Button */}
      <Button
        fullWidth
        variant="outlined"
        onClick={fetchImages}
        disabled={loading}
        sx={{ mb: 4 }}
        size="small"
      >
        {loading ? "Loading..." : "Refresh Feed"}
      </Button>

      {/* Images Grid */}
      <Grid container spacing={2}>
        {images.map((img, index) => (
          <Grid item xs={12} key={index}>
            <Card>
              <CardHeader
                avatar={
                  <Avatar sx={{ width: 32, height: 32 }}>
                    {img.userName[0]}
                  </Avatar>
                }
                title={img.userName}
                subheader={`@${img.userID}`}
                sx={{ py: 1 }}
              />
              <CardMedia
                component="img"
                image={BLOB_ACCOUNT + img.filePath}
                alt={img.fileName}
                sx={{
                  height: 200,  // Fixed height
                  objectFit: "cover"  // This will ensure the image covers the area without stretching
                }}
                onError={(e) => {
                  console.error('Image failed to load:', img.filePath);
                  e.target.src = 'https://via.placeholder.com/400x300?text=Image+Load+Error';
                }}
              />
              <CardContent sx={{ py: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  {img.fileName}
                </Typography>
              </CardContent>
              <CardActions disableSpacing sx={{ py: 0 }}>
                <IconButton aria-label="add to favorites" size="small">
                  <Favorite fontSize="small" />
                </IconButton>
                <IconButton aria-label="comment" size="small">
                  <Comment fontSize="small" />
                </IconButton>
                <IconButton aria-label="share" size="small">
                  <Share fontSize="small" />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default App;