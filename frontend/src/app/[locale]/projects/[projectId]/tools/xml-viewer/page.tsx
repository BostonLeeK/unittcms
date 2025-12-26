import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import XMLTestResultsViewer from './XMLTestResultsViewer';
import { XMLTestResultsViewerMessages } from '@/types/xmlTestResults';
import { LocaleCodeType } from '@/types/locale';

export async function generateMetadata({ params: { locale } }: { params: { locale: LocaleCodeType } }) {
  const t = await getTranslations({ locale, namespace: 'XMLTestResultsViewer' });
  return {
    title: `${t('title')} | UnitTCMS`,
    robots: { index: false, follow: false },
  };
}

export default function Page({ params }: { params: { projectId: string; locale: string } }) {
  const t = useTranslations('XMLTestResultsViewer');
  const messages: XMLTestResultsViewerMessages = {
    title: t('title'),
    uploadTitle: t('upload_title'),
    uploadDescription: t('upload_description'),
    selectFile: t('select_file'),
    selectedFile: t('selected_file'),
    totalTests: t('total_tests'),
    passed: t('passed'),
    failed: t('failed'),
    skipped: t('skipped'),
    tests: t('tests'),
    failures: t('failures'),
    classname: t('classname'),
    failure: t('failure'),
    message: t('message'),
    success: t('success'),
    error: t('error'),
    invalidFileType: t('invalid_file_type'),
    fileLoaded: t('file_loaded'),
    failedToParse: t('failed_to_parse'),
  };

  return <XMLTestResultsViewer messages={messages} />;
}

