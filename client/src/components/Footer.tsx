import { Container, Grid, Title, Text, Stack, ActionIcon, Group, Anchor } from '@mantine/core';
import { IconBrandFacebook, IconBrandYoutube, IconMapPin, IconPhone, IconMail } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

export function Footer() {
    return (
        <footer style={{ backgroundColor: '#f8f9fa', paddingTop: '20px', paddingBottom: '20px', marginTop: 'auto', borderTop: '1px solid #e9ecef' }}>
            <Container size="lg">
                <Grid>
                    {/* Company Info */}
                    <Grid.Col span={{ base: 12, md: 5 }}>
                        <Stack gap="xs">
                            <Title order={4} c="blue">BookingCare</Title>
                            <Text size="sm" c="dimmed">
                                Nền tảng y tế chăm sóc sức khỏe toàn diện hàng đầu Việt Nam.
                            </Text>
                            <Stack gap={4}>
                                <Group gap="xs">
                                    <IconMapPin size={16} />
                                    <Text size="sm"> Trường Đại học Thăng Long </Text>
                                </Group>
                                <Group gap="xs">
                                    <IconPhone size={16} />
                                    <Text size="sm">024-1234-5678</Text>
                                </Group>
                                <Group gap="xs">
                                    <IconMail size={16} />
                                    <Text size="sm">nickgearupbooster@gmail.com</Text>
                                </Group>
                            </Stack>
                        </Stack>
                    </Grid.Col>

                    {/* Quick Links */}
                    <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                        <Title order={6} mb="xs">Về chúng tôi</Title>
                        <Stack gap={4}>
                            <Anchor component={Link} to="/" c="dimmed" size="sm">Trang chủ</Anchor>
                            <Anchor component={Link} to="/search" c="dimmed" size="sm">Danh sách bác sĩ</Anchor>
                            <Anchor href="#" c="dimmed" size="sm">Giới thiệu</Anchor>
                            <Anchor href="#" c="dimmed" size="sm">Điều khoản sử dụng</Anchor>
                            <Anchor href="#" c="dimmed" size="sm">Chính sách bảo mật</Anchor>
                        </Stack>
                    </Grid.Col>

                    {/* Support & Social */}
                    <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                        <Title order={6} mb="xs">Hỗ trợ khách hàng</Title>
                        <Stack gap={4} mb="md">
                            <Anchor href="#" c="dimmed" size="sm">Câu hỏi thường gặp</Anchor>
                            <Anchor href="#" c="dimmed" size="sm">Quy trình đặt lịch</Anchor>
                            <Anchor href="#" c="dimmed" size="sm">Chính sách giải quyết khiếu nại</Anchor>
                        </Stack>

                        <Title order={6} mb="xs">Kết nối với chúng tôi</Title>
                        <Group gap="sm">
                            <ActionIcon size="md" color="blue" variant="subtle">
                                <IconBrandFacebook size={20} />
                            </ActionIcon>
                            <ActionIcon size="md" color="red" variant="subtle">
                                <IconBrandYoutube size={20} />
                            </ActionIcon>
                        </Group>
                    </Grid.Col>
                </Grid>

                <Text ta="center" size="xs" c="dimmed" mt="md" pt="md" style={{ borderTop: '1px solid #dee2e6' }}>
                    © 2025 BookingCare Clone. All rights reserved.
                </Text>
            </Container>
        </footer>
    );
}
