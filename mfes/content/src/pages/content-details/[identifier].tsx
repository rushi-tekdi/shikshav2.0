// pages/content-details/[identifier].tsx

'use client';
import React, { useEffect, useState } from 'react';
import { Box, Button, Divider, Typography } from '@mui/material';
import { Layout } from '@shared-lib';
import LogoutIcon from '@mui/icons-material/Logout';

import Grid from '@mui/material/Grid2';

import { useRouter } from 'next/router';
import { fetchContent } from '../../services/Read';

interface ContentDetailsObject {
  name: string;
  [key: string]: any;
}

const ContentDetails = () => {
  const router = useRouter();
  const { identifier } = router.query;
  const [searchValue, setSearchValue] = useState('');
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [contentDetails, setContentDetails] =
    useState<ContentDetailsObject | null>(null);
  const handleBackClick = () => {
    router.back(); // Navigate to the previous page
  };
  const handleAccountClick = (event: React.MouseEvent<HTMLElement>) => {
    console.log('Account clicked');
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
    localStorage.removeItem('accToken');
    router.push(`${process.env.NEXT_PUBLIC_LOGIN}`);
  };

  const handleMenuClick = () => {
    console.log('Menu icon clicked');
  };

  const handleSearchClick = () => {
    console.log('Search button clicked');
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const fetchContentDetails = async () => {
    try {
      if (identifier) {
        const result = await fetchContent(identifier as string);
        setContentDetails(result);
      }
    } catch (error) {
      console.error('Failed to fetch content:', error);
    }
  };

  useEffect(() => {
    if (identifier) {
      fetchContentDetails();
    }
  }, [identifier]);

  if (!identifier) {
    return <Typography>Loading...</Typography>; // Show loading state while identifier is undefined
  }
  return (
    <Layout
      showTopAppBar={{
        title: 'Shiksha',
        showMenuIcon: true,

        menuIconClick: handleMenuClick,
        actionButtonLabel: 'Action',
        actionIcons: [
          {
            icon: <LogoutIcon />,
            ariaLabel: 'Account',
            onLogoutClick: (e: any) => handleAccountClick(e),
            anchorEl: anchorEl,
          },
        ],
        onMenuClose: handleClose,
      }}
      showBack={true}
      backTitle="Course Details"
      backIconClick={handleBackClick}
      isFooter={false}
      showLogo={true}
      sx={{ height: '0vh' }}
    >
      <Grid container spacing={2} sx={{ marginTop: '120px' }}>
        <Grid size={{ xs: 12 }} sx={{ textAlign: 'center' }}>
          <Typography fontSize={'22px'} fontWeight={400}>
            {contentDetails?.name}
          </Typography>
          <Box
            sx={{
              margin: 'auto',
              textAlign: 'center',
              width: { xs: '100%', sm: '100%', md: '500px', lg: '500px' },
              // height: { xs: 'auto', md: 'auto', lg: '100vh' },
            }}
          >
            <img
              src={
                contentDetails?.posterImage || '/assets/images/default_hori.png'
              }
              alt="Course Thumbnail"
              style={{
                width: '80%',
                borderRadius: '8px',
                marginBottom: '16px',
              }}
            />
          </Box>
        </Grid>
      </Grid>

      {/* Section Header */}
      <Grid container spacing={2} sx={{ marginBottom: '16px' }}>
        <Grid size={{ xs: 12 }}>
          <Typography fontSize={'22px'} fontWeight={400}>
            Description
          </Typography>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Typography fontSize={'14px'} fontWeight={400}>
            {contentDetails?.description
              ? contentDetails.description
              : 'No description available'}
          </Typography>
          <Grid
            container
            spacing={2}
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography fontSize={'22px'} fontWeight={400}>
              Tags
            </Typography>
            <Grid size={{ xs: 12 }}>
              {contentDetails?.keywords?.map((tag: string) => (
                <Button
                  key={tag}
                  variant="contained"
                  sx={{
                    bgcolor: '#49454F1F',
                    color: '#1D1B20',
                    margin: '3px',
                    fontSize: '12px',
                    backgroundColor: '#E9E9EA',
                    borderRadius: '5px',
                    boxShadow: 'none',
                    textTransform: 'none',
                  }}
                >
                  {tag}
                </Button>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Divider sx={{ borderWidth: '1px', width: '100%', marginTop: '16px' }} />
      <Grid container justifyContent="center" sx={{ marginBottom: '16px' }}>
        <Button
          variant="contained"
          sx={{
            bgcolor: '#6750A4',
            color: '#FFFFFF',
            margin: '12px',
            borderRadius: '100px',
            textTransform: 'none',
            boxShadow: 'none',
          }}
          onClick={() => router.push(`/details/${identifier}`)}
        >
          Join Now/Start Course
        </Button>
      </Grid>
    </Layout>
  );
};

export default ContentDetails;
