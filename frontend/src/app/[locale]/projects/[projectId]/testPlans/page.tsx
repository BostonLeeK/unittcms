'use client';
import { useState, useEffect, useContext } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@heroui/react';
import { Plus } from 'lucide-react';
import { useRouter } from '@/src/i18n/routing';
import { TokenContext } from '@/utils/TokenProvider';
import { fetchTestPlans, createTestPlan, deleteTestPlan } from '@/utils/testPlansControl';
import { TestPlanType, TestPlanMessages } from '@/types/testPlan';
import { LocaleCodeType } from '@/types/locale';
import { logError } from '@/utils/errorHandler';
import { addToast } from '@heroui/react';
import TestPlanDialog from './TestPlanDialog';
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog';
import TestPlanTable from './TestPlanTable';

export default function Page({ params }: { params: { projectId: string; locale: string } }) {
    const t = useTranslations('TestPlans');
    const context = useContext(TokenContext);
    const router = useRouter();
    const [plans, setPlans] = useState<TestPlanType[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [deletePlanId, setDeletePlanId] = useState<number | null>(null);

    const messages: TestPlanMessages = {
        testPlans: t('test_plans'),
        testPlan: t('test_plan'),
        newTestPlan: t('new_test_plan'),
        editTestPlan: t('edit_test_plan'),
        deleteTestPlan: t('delete_test_plan'),
        testPlanName: t('test_plan_name'),
        testPlanDescription: t('test_plan_description'),
        close: t('close'),
        create: t('create'),
        update: t('update'),
        pleaseEnter: t('please_enter'),
        delete: t('delete'),
        areYouSure: t('are_you_sure'),
        noTestPlansFound: t('no_test_plans_found'),
        task: t('task'),
        tasks: t('tasks'),
        newTask: t('new_task'),
        editTask: t('edit_task'),
        deleteTask: t('delete_task'),
        taskTitle: t('task_title'),
        taskDescription: t('task_description'),
        step: t('step'),
        steps: t('steps'),
        newStep: t('new_step'),
        editStep: t('edit_step'),
        deleteStep: t('delete_step'),
        stepDescription: t('step_description'),
        expectedResult: t('expected_result'),
        order: t('order'),
        addStep: t('add_step'),
        addTask: t('add_task'),
    };

    useEffect(() => {
        async function fetchData() {
            if (!context.isSignedIn()) return;
            try {
                const data = await fetchTestPlans(context.token.access_token, Number(params.projectId));
                setPlans(data || []);
            } catch (error: unknown) {
                logError('Error fetching test plans:', error);
            }
        }
        fetchData();
    }, [context, params.projectId]);

    const handleCreate = async (name: string, description: string) => {
        try {
            const newPlan = await createTestPlan(context.token.access_token, name, description, params.projectId);
            setPlans([...plans, newPlan]);
            setIsDialogOpen(false);
            addToast({
                title: 'Success',
                color: 'success',
                description: 'Test plan created successfully',
            });
        } catch (error: unknown) {
            logError('Error creating test plan:', error);
            addToast({
                title: 'Error',
                color: 'danger',
                description: 'Failed to create test plan',
            });
        }
    };

    const handleDelete = (planId: number) => {
        setDeletePlanId(planId);
        setIsDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (deletePlanId) {
            try {
                await deleteTestPlan(context.token.access_token, deletePlanId);
                setPlans(plans.filter((p) => p.id !== deletePlanId));
                setIsDeleteDialogOpen(false);
                setDeletePlanId(null);
                addToast({
                    title: 'Success',
                    color: 'success',
                    description: 'Test plan deleted successfully',
                });
            } catch (error: unknown) {
                logError('Error deleting test plan:', error);
                addToast({
                    title: 'Error',
                    color: 'danger',
                    description: 'Failed to delete test plan',
                });
            }
        }
    };

    const handlePlanClick = (planId: number) => {
        router.push(`/projects/${params.projectId}/testPlans/${planId}`, { locale: params.locale });
    };

    return (
        <div className="container mx-auto max-w-7xl pt-6 px-6 flex-grow">
            <div className="w-full p-3 flex items-center justify-between">
                <h3 className="font-bold">{messages.testPlans}</h3>
                {context.isProjectDeveloper(Number(params.projectId)) && (
                    <Button
                        startContent={<Plus size={16} />}
                        size="sm"
                        color="primary"
                        onPress={() => setIsDialogOpen(true)}
                    >
                        {messages.newTestPlan}
                    </Button>
                )}
            </div>

            {plans.length === 0 ? (
                <div className="w-full p-3 flex items-center justify-center">
                    <h3 className="font-bold">{messages.noTestPlansFound}</h3>
                </div>
            ) : (
                <TestPlanTable
                    plans={plans}
                    onPlanClick={handlePlanClick}
                    onDelete={handleDelete}
                    isDisabled={!context.isProjectDeveloper(Number(params.projectId))}
                    messages={messages}
                />
            )}

            <TestPlanDialog
                isOpen={isDialogOpen}
                onCancel={() => setIsDialogOpen(false)}
                onSubmit={handleCreate}
                messages={messages}
            />

            <DeleteConfirmDialog
                isOpen={isDeleteDialogOpen}
                onCancel={() => {
                    setIsDeleteDialogOpen(false);
                    setDeletePlanId(null);
                }}
                onConfirm={handleConfirmDelete}
                closeText={messages.close}
                confirmText={messages.areYouSure}
                deleteText={messages.delete}
            />
        </div>
    );
}




