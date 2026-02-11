import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView, View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList, Dimensions, StatusBar, Animated,
} from 'react-native';

const colors = {
  background: '#020617', surface: '#0B1120', surfaceAlt: '#111827', primary: '#22D3EE', primaryAlt: '#4F46E5', textPrimary: '#F9FAFB', textSecondary: '#9CA3AF', textMuted: '#6B7280', borderSubtle: '#1F2937',
};

const spacing = {
  xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24,
};

const SCREENS = {
  DASHBOARD: 'DASHBOARD', INSTANT_SCAN_CAMERA: 'INSTANT_SCAN_CAMERA', INSTANT_SCAN_REVIEW: 'INSTANT_SCAN_REVIEW', FLEXI_PICKER: 'FLEXI_PICKER', FLEXI_CONVERT: 'FLEXI_CONVERT', PDF_MERGE: 'PDF_MERGE', PDF_SPLIT: 'PDF_SPLIT', QUICK_COMPRESS_PICKER: 'QUICK_COMPRESS_PICKER', QUICK_COMPRESS_SLIDER: 'QUICK_COMPRESS_SLIDER', OUTPUT_SHARE: 'OUTPUT_SHARE',
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState(SCREENS.DASHBOARD);
  const [screenParams, setScreenParams] = useState({});
  const transition = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    transition.setValue(0);
    Animated.timing(transition, {
      toValue: 1, duration: 220, useNativeDriver: true, }).start();
  }, [currentScreen, transition]);

  const navigate = (screen, params = {}) => {
    setScreenParams(params);
    setCurrentScreen(screen);
  };

  const goBack = () => {
    setCurrentScreen(SCREENS.DASHBOARD);
    setScreenParams({});
  };

  let content = null;

  switch (currentScreen) {
    case SCREENS.INSTANT_SCAN_CAMERA:
      content = <InstantScanCameraScreen onBack={goBack} onCaptured={() => navigate(SCREENS.INSTANT_SCAN_REVIEW)} />;
      break;
    case SCREENS.INSTANT_SCAN_REVIEW:
      content = (
        <InstantScanReviewScreen
          onBack={goBack}
          onAddPage={() => navigate(SCREENS.INSTANT_SCAN_CAMERA)}
          onFinish={() => navigate(SCREENS.OUTPUT_SHARE, { type: 'pdf' })}
        />
      );
      break;
    case SCREENS.FLEXI_PICKER:
      content = (
        <FlexiConvertPickerScreen
          onBack={goBack}
          onNext={() => navigate(SCREENS.FLEXI_CONVERT)}
        />
      );
      break;
    case SCREENS.FLEXI_CONVERT:
      content = (
        <FlexiConvertConvertScreen
          onBack={goBack}
          onDone={() => navigate(SCREENS.OUTPUT_SHARE, { type: 'image' })}
        />
      );
      break;
    case SCREENS.PDF_MERGE:
      content = (
        <PDFMergeScreen
          onBack={goBack}
          onMerge={() => navigate(SCREENS.OUTPUT_SHARE, { type: 'pdf' })}
        />
      );
      break;
    case SCREENS.PDF_SPLIT:
      content = (
        <PDFSplitScreen
          onBack={goBack}
          onCreate={() => navigate(SCREENS.OUTPUT_SHARE, { type: 'pdf' })}
        />
      );
      break;
    case SCREENS.QUICK_COMPRESS_PICKER:
      content = (
        <QuickCompressPickerScreen
          onBack={goBack}
          onNext={() => navigate(SCREENS.QUICK_COMPRESS_SLIDER)}
        />
      );
      break;
    case SCREENS.QUICK_COMPRESS_SLIDER:
      content = (
        <QuickCompressSliderScreen
          onBack={goBack}
          onCompress={() => navigate(SCREENS.OUTPUT_SHARE, { type: 'image' })}
        />
      );
      break;
    case SCREENS.OUTPUT_SHARE:
      content = <OutputShareScreen onBack={goBack} type={screenParams.type || 'pdf'} />;
      break;
    case SCREENS.DASHBOARD:
    default:
      content = (
        <DashboardScreen
          onInstantScan={() => navigate(SCREENS.INSTANT_SCAN_CAMERA)}
          onFlexiConvert={() => navigate(SCREENS.FLEXI_PICKER)}
          onPDFWeaver={() => navigate(SCREENS.PDF_MERGE)}
          onQuickCompress={() => navigate(SCREENS.QUICK_COMPRESS_PICKER)}
        />
      );
  }

  const animatedStyle = {
    opacity: transition, transform: [
      {
        translateY: transition.interpolate({
          inputRange: [0, 1], outputRange: [12, 0], }), }, ], };

  return (
    <SafeAreaView style={styles.appRoot}>
      <StatusBar barStyle="light-content" />
      <Animated.View style={[{ flex: 1 }, animatedStyle]}>
        {content}
      </Animated.View>
    </SafeAreaView>
  );
}

const DashboardScreen = ({ onInstantScan, onFlexiConvert, onPDFWeaver, onQuickCompress }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.appTitle}>PhotonFlow</Text>
        <Text style={styles.tagline}>Blazing-fast document & image tools</Text>
        <View style={styles.privacyPill}>
          <Text style={styles.privacyText}>All processing happens on your device</Text>
        </View>
      </View>

      <View style={styles.grid}>
        <View style={styles.row}>
          <FeatureCard
            title="InstantScan"
            subtitle="Scan docs to clean PDFs"
            onPress={onInstantScan}
          />
