import { Table, Badge, Button, Group, Text, ActionIcon, Menu } from '@mantine/core';
import { IconDots, IconCheck, IconX, IconStethoscope, IconTrash } from '@tabler/icons-react';
import { Appointment } from '../../types/entities/Appointment';
import dayjs from 'dayjs';

interface DoctorAppointmentTableProps {
    appointments: Appointment[];
    onUpdateStatus: (id: string, status: 'confirmed' | 'completed' | 'cancelled') => void;
    onDelete?: (id: string) => void;
}

export function DoctorAppointmentTable({ appointments, onUpdateStatus, onDelete }: DoctorAppointmentTableProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed': return 'blue';
            case 'completed': return 'green';
            case 'cancelled': return 'red';
            default: return 'yellow';
        }
    };

    const rows = appointments.map((appointment) => (
        <Table.Tr key={appointment.id}>
            <Table.Td>
                <Text size="sm" fw={500}>
                    {dayjs(appointment.date).format('DD/MM/YYYY')}
                </Text>
                <Text size="xs" c="dimmed">
                    {appointment.timeText}
                </Text>
            </Table.Td>
            <Table.Td>
                <Text size="sm" fw={500}>{appointment.patientName}</Text>
                <Text size="xs" c="dimmed">{appointment.patientPhone}</Text>
            </Table.Td>
            <Table.Td>
                <Text size="sm">{appointment.reason}</Text>
            </Table.Td>
            <Table.Td>
                <Badge color={getStatusColor(appointment.status)} variant="light">
                    {appointment.status}
                </Badge>
            </Table.Td>
            <Table.Td>
                <Group gap={5} justify="flex-end">
                    {appointment.status === 'pending' && (
                        <Button
                            size="xs"
                            variant="light"
                            color="blue"
                            leftSection={<IconCheck size={14} />}
                            onClick={() => onUpdateStatus(appointment.id, 'confirmed')}
                        >
                            Xác nhận
                        </Button>
                    )}

                    {appointment.status === 'confirmed' && (
                        <Button
                            size="xs"
                            variant="light"
                            color="green"
                            leftSection={<IconStethoscope size={14} />}
                            onClick={() => onUpdateStatus(appointment.id, 'completed')}
                        >
                            Đã khám
                        </Button>
                    )}

                    <Menu shadow="md" width={200}>
                        <Menu.Target>
                            <ActionIcon variant="subtle" color="gray">
                                <IconDots size={16} />
                            </ActionIcon>
                        </Menu.Target>

                        <Menu.Dropdown>
                            {appointment.status === 'cancelled' ? (
                                <Menu.Item
                                    color="red"
                                    leftSection={<IconTrash size={14} />}
                                    onClick={() => onDelete?.(appointment.id)}
                                >
                                    Xóa lịch hẹn
                                </Menu.Item>
                            ) : (
                                <Menu.Item
                                    color="red"
                                    leftSection={<IconX size={14} />}
                                    onClick={() => onUpdateStatus(appointment.id, 'cancelled')}
                                >
                                    Hủy lịch hẹn
                                </Menu.Item>
                            )}
                        </Menu.Dropdown>
                    </Menu>
                </Group>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <Table verticalSpacing="sm" highlightOnHover>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th>Thời gian</Table.Th>
                    <Table.Th>Bệnh nhân</Table.Th>
                    <Table.Th>Lý do khám</Table.Th>
                    <Table.Th>Trạng thái</Table.Th>
                    <Table.Th style={{ textAlign: 'right' }}>Hành động</Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
        </Table>
    );
}
