'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Box } from '@mui/material';
import { CommonCard, CommonTabs, Layout, Circular } from '@shared-lib';
import { ContentSearch } from '../services/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import Grid from '@mui/material/Grid2';
import { useRouter, useSearchParams } from 'next/navigation';
import MailIcon from '@mui/icons-material/Mail';
import { hierarchyAPI } from '../services/Hierarchy';
import { contentReadAPI } from '../services/Read';
interface ContentItem {
  name: string;
  gradeLevel: string[];
  language: string[];
  artifactUrl: string;
  identifier: string;
  appIcon: string;
  contentType: string;
  mimeType: string;
  description: string;
  posterImage: string;
}

export default function Content() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const identifier = searchParams.get('identifier');
  const [searchValue, setSearchValue] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [contentData, setContentData] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedContent, setSelectedContent] = useState<any>(null);
  const [language, setLanguage] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedContentTypes, setSelectedContentTypes] = useState<string[]>(
    []
  );
  const [sort, setSort] = useState<string>('asc');

  const fetchContent = useCallback(
    async (type?: string, searchValue?: string) => {
      setIsLoading(true);
      try {
        let result;
        if (identifier) {
          result = await hierarchyAPI(identifier);
          if (result) setContentData([result]);
        } else {
          result = type && (await ContentSearch(type, searchValue));

          setContentData(result || []);
        }
      } catch (error) {
        console.error('Failed to fetch content:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [identifier, searchValue]
  );

  useEffect(() => {
    const type = tabValue === 0 ? 'Course' : 'Learning Resource';
    fetchContent(type);
  }, [fetchContent, tabValue]);

  const handleAccountClick = () => {
    console.log('Account clicked');
  };

  const handleSearchClick = () => {
    if (searchValue.trim()) {
      const type = tabValue === 0 ? 'Course' : 'Learning Resource';
      fetchContent(type, searchValue);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCardClick = async (
    identifier: string,
    contentMimeType: string
  ) => {
    setIsLoading(true);
    try {
      if (
        [
          'application/vnd.ekstep.ecml-archive',
          'application/vnd.ekstep.html-archive',
          'application/vnd.ekstep.h5p-archive',
          'application/pdf',
          'video/mp4',
          'video/webm',
          'application/epub',
          'application/vnd.sunbird.questionset',
        ].includes(contentMimeType)
      ) {
        await contentReadAPI(identifier);
        router.push(`/player/${identifier}`);
      } else {
        const result = await hierarchyAPI(identifier);
        const trackable = result?.trackable;
        setSelectedContent(result);

        router.push(`/content-details/${identifier}`);
      }
    } catch (error) {
      console.error('Failed to fetch content:', error);
    } finally {
      setIsLoading(false);
    }
  };
  ``;

  const renderTabContent = () => (
    <Box sx={{ flexGrow: 1 }}>
      {isLoading ? (
        <Circular />
      ) : (
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {contentData.map((item) => (
            <Grid key={item?.identifier} size={{ xs: 6, sm: 6, md: 3, lg: 3 }}>
              <CommonCard
                title={item?.name.trim()}
                image={item?.posterImage || '/assets/images/image_ver.png'}
                content={item?.description || '-'}
                // subheader={item?.contentType}
                actions={item?.contentType}
                orientation="horizontal"
                onClick={() =>
                  handleCardClick(item?.identifier, item?.mimeType)
                }
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );

  const tabs = [
    {
      label: 'Courses',
      content: renderTabContent(),
    },
    {
      label: 'Content',
      content: renderTabContent(),
    },
  ];

  const handleItemClick = (to: string) => {
    router.push(to);
  };

  const drawerItems = [
    { text: 'Home', icon: <MailIcon />, to: '/' },
    { text: 'Page2', icon: <MailIcon />, to: '/page-2' },
    { text: 'Content', icon: <MailIcon />, to: '/content' },
  ];
  const filter = {
    sort: true,
    language: [
      'Mathematics',
      'Science',
      'Environmental Sciences',
      'English',
      'Hindi',
    ],
    subject: [
      'Mathematics',
      'Science',
      'Environmental Sciences',
      'English',
      'Hindi',
    ],
    contentType: ['Video', 'PDF', 'E-Book', 'Quiz'],
  };
  const handleApplyFilters = () => {
    console.log('Selected Language:', language);
    console.log('Selected Subjects:', selectedSubjects);
    console.log('Selected Content Types:', selectedContentTypes);
    console.log('Sort Order:', sort);
  };
  const handleSubjectsChange = (subjects: string[]) => {
    setSelectedSubjects(subjects); // Update the selected subjects as an array
  };
  const handleContentTypeChange = (contentType: string[]) => {
    setSelectedContentTypes(contentType); // Update the selected subjects as an array
  };
  const handleSortChange = (newSort: string) => {
    console.log('Sort Order:', newSort);
    setSort(newSort);
  };
  return (
    <Layout
      showTopAppBar={{
        title: 'Shiksha: Home',
        showMenuIcon: true,
        actionButtonLabel: 'Action',
        actionIcons: [
          {
            icon: <AccountCircleIcon />,
            ariaLabel: 'Account',
            onClick: handleAccountClick,
          },
        ],
      }}
      showSearch={{
        placeholder: 'Search content..',
        rightIcon: <SearchIcon />,
        inputValue: searchValue,
        onInputChange: handleSearchChange,
        onRightIconClick: handleSearchClick,
        sx: {
          backgroundColor: '#f0f0f0',
          padding: '4px',
          borderRadius: '50px',
          width: '100%',
        },
      }}
      drawerItems={drawerItems}
      showFilter={true}
      filter={filter}
      onItemClick={handleItemClick}
      isFooter={false}
      showLogo={true}
      showBack={true}
      language={language}
      selectedSubjects={selectedSubjects}
      selectedContentTypes={selectedContentTypes}
      sort={{ sortBy: sort }}
      onLanguageChange={(newLang) => setLanguage(newLang)}
      onSubjectsChange={handleSubjectsChange}
      onContentTypeChange={handleContentTypeChange}
      onSortChange={handleSortChange}
      onApply={handleApplyFilters}
    >
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          bgcolor: '#FEF7FF',
          flexDirection: 'column',
          marginTop: '20px',
        }}
      >
        <CommonTabs
          tabs={tabs}
          value={tabValue}
          onChange={handleTabChange}
          ariaLabel="Custom icon label tabs"
        />
      </Box>
    </Layout>
  );
}
