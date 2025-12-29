'use client';
import { Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@heroui/react';
import { MoreVertical, Trash } from 'lucide-react';
import { TestPlanType, TestPlanMessages } from '@/types/testPlan';

type Props = {
    plans: TestPlanType[];
    onPlanClick: (planId: number) => void;
    onDelete: (planId: number) => void;
    isDisabled: boolean;
    messages: TestPlanMessages;
};

export default function TestPlanTable({ plans, onPlanClick, onDelete, isDisabled, messages }: Props) {
    return (
        <div className="w-full">
            <table className="w-full">
                <thead>
                    <tr>
                        <th className="text-left p-3 border-b border-divider">{messages.testPlanName}</th>
                        <th className="text-left p-3 border-b border-divider">{messages.testPlanDescription}</th>
                        <th className="text-left p-3 border-b border-divider">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {plans.map((plan) => (
                        <tr key={plan.id} className="hover:bg-default-100 cursor-pointer" onClick={() => onPlanClick(plan.id)}>
                            <td className="p-3">{plan.name}</td>
                            <td className="p-3">{plan.description || '-'}</td>
                            <td className="p-3" onClick={(e) => e.stopPropagation()}>
                                <Dropdown>
                                    <DropdownTrigger>
                                        <Button isIconOnly radius="full" size="sm" variant="light">
                                            <MoreVertical size={16} />
                                        </Button>
                                    </DropdownTrigger>
                                    <DropdownMenu aria-label="Static Actions">
                                        <DropdownItem
                                            key="delete"
                                            className="text-danger"
                                            color="danger"
                                            onPress={() => onDelete(plan.id)}
                                            isDisabled={isDisabled}
                                        >
                                            <div className="flex items-center gap-2">
                                                <Trash size={16} />
                                                <span>{messages.delete}</span>
                                            </div>
                                        </DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}


