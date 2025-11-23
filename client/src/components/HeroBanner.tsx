import { Container, Title, Text, Button, Box, Stack, Grid, Image } from '@mantine/core';
import { IconCalendar } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

export function HeroBanner() {
    return (
        <Box
            style={{
                position: 'relative',
                background: 'linear-gradient(90deg, #005bea 0%, #00c6fb 100%)',
                overflow: 'hidden',
                paddingTop: '60px',
                paddingBottom: '60px',
            }}
        >
            <Container size="xl" style={{ position: 'relative', zIndex: 1 }}>
                <Grid align="center" gutter={50}>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <Stack gap="xl">
                            <Title
                                order={1}
                                size={50}
                                fw={800}
                                c="white"
                                style={{
                                    lineHeight: 1.2,
                                    textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                }}
                            >
                                Chăm sóc sức khỏe{' '}
                                <Text
                                    component="span"
                                    inherit
                                    style={{ display: 'block' }}
                                >
                                    mọi lúc, mọi nơi
                                </Text>
                            </Title>

                            <Text size="lg" c="white" style={{ opacity: 0.9, maxWidth: '500px' }}>
                                Đặt lịch khám bệnh trực tuyến với các bác sĩ chuyên khoa hàng đầu.
                                Không chờ đợi, tư vấn tận tâm, bảo mật tuyệt đối.
                            </Text>

                            <Button
                                component={Link}
                                to="/search"
                                size="lg"
                                leftSection={<IconCalendar size={20} />}
                                variant="white"
                                color="blue"
                                w="fit-content"
                                style={{
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                }}
                            >
                                Đặt lịch khám ngay
                            </Button>
                        </Stack>
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, md: 6 }} visibleFrom="md">
                        <Box
                            style={{
                                position: 'relative',
                                height: '400px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Image
                                src="https://img.freepik.com/free-vector/doctor-character-background_1270-84.jpg"
                                fallbackSrc="https://cdn.dribbble.com/users/1355613/screenshots/15252730/media/28f348daf95550438c5c843764422579.jpg"
                                style={{
                                    maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
                                    objectFit: 'cover',
                                    height: '100%',
                                    width: 'auto',
                                    borderRadius: '16px',
                                    boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
                                }}
                            />
                        </Box>
                    </Grid.Col>
                </Grid>
            </Container>
        </Box>
    );
}
