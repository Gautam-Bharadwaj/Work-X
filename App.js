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
          <View style={styles.spacer} />
          <FeatureCard
            title="FlexiConvert"
            subtitle="Change image formats fast"
            onPress={onFlexiConvert}
          />
        </View>
        <View style={styles.row}>
          <FeatureCard
            title="PDF Weaver"
            subtitle="Merge & split PDFs"
            onPress={onPDFWeaver}
          />
          <View style={styles.spacer} />
          <FeatureCard
            title="QuickCompress"
            subtitle="Shrink images smartly"
            onPress={onQuickCompress}
          />
        </View>
      </View>

      <Text style={styles.footerText}>No ads. No uploads. Just speed.</Text>
    </View>
  );
};

const FeatureCard = ({ title, subtitle, onPress }) => (
  <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={styles.featureCard}>
    <View style={styles.iconCircle}>
      <Text style={styles.iconLetter}>{title.charAt(0)}</Text>
    </View>
    <Text style={styles.featureTitle}>{title}</Text>
    <Text style={styles.featureSubtitle}>{subtitle}</Text>
  </TouchableOpacity>
);

const InstantScanCameraScreen = ({ onBack, onCaptured }) => {
  return (
    <View style={styles.screenContainer}>
      <Header title="InstantScan" onBack={onBack} rightIcons={['⚡', 'i']} />
      <View style={styles.cameraFrame}>
        <View style={styles.glowBox}>
          <Text style={styles.cameraHint}>Align your document inside the frame</Text>
        </View>
      </View>
      <View style={styles.bottomBar}>
        <View style={styles.thumbnail} />
        <TouchableOpacity style={styles.captureOuter} onPress={onCaptured} activeOpacity={0.8}>
          <View style={styles.captureInner} />
        </TouchableOpacity>
        <View style={styles.galleryShortcut}>
          <Text style={styles.galleryIcon}>🖼</Text>
        </View>
      </View>
    </View>
  );
};

const InstantScanReviewScreen = ({ onBack, onAddPage, onFinish }) => {
  return (
    <View style={styles.screenContainer}>
      <Header title="Review scan" onBack={onBack} rightText="Retake" />
      <View style={styles.reviewContent}>
        <View style={styles.pagePreview}>
          <Text style={styles.previewText}>Scanned page preview</Text>
        </View>

        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Enhance</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.enhanceScroll}
          contentContainerStyle={{ paddingHorizontal: spacing.lg }}
        >
          {['Magic Color', 'Grayscale', 'B&W', 'Soft'].map((preset, index) => (
            <View key={preset} style={[styles.presetCard, index === 0 && styles.presetCardSelected]}>
              <View style={styles.presetThumbnail} />
              <Text style={styles.presetLabel}>{preset}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.pageStrip}>
          {Array.from({ length: 3 }).map((_, idx) => (
            <View
              key={idx}
              style={[styles.pageThumb, idx === 0 && styles.pageThumbActive]}
            />
          ))}
        </View>
      </View>

      <View style={styles.bottomButtonsRow}>
        <PrimaryButton label="Add Page" variant="secondary" onPress={onAddPage} />
        <PrimaryButton label="Finish" onPress={onFinish} />
      </View>
    </View>
  );
};

const FlexiConvertPickerScreen = ({ onBack, onNext }) => {
  const data = Array.from({ length: 18 }).map((_, i) => ({ id: String(i) }));
  const numColumns = 3;
  const screenWidth = Dimensions.get('window').width;
  const sidePadding = spacing.lg;
  const gap = spacing.sm;
  const cardWidth = (screenWidth - sidePadding * 2 - gap * (numColumns - 1)) / numColumns;

  const renderItem = ({ item }) => (
    <View style={[styles.imageItem, { width: cardWidth, height: cardWidth }]}>
      <View style={styles.imageBadge}>
        <Text style={styles.imageBadgeText}>JPG</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.screenContainer}>
      <Header title="FlexiConvert" onBack={onBack} rightIcons={['⋮']} />
      <View style={styles.segmentedWrapper}>
        {['All', 'Photos', 'Screenshots', 'Recent'].map((label, index) => (
          <View
            key={label}
            style={[styles.segmentChip, index === 0 && styles.segmentChipActive]}
          >
            <Text
              style={[
                styles.segmentLabel, index === 0 && styles.segmentLabelActive, ]}
            >
              {label}
            </Text>
          </View>
        ))}
      </View>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        columnWrapperStyle={{ gap }}
        contentContainerStyle={{
          paddingHorizontal: sidePadding, paddingTop: spacing.lg, paddingBottom: 100, gap, }}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
      <View style={styles.bottomBarSolid}>
        <Text style={styles.bottomInfo}>Selected: 3</Text>
        <PrimaryButton label="Next" onPress={onNext} />
      </View>
    </View>
  );
};

const FlexiConvertConvertScreen = ({ onBack, onDone }) => {
  return (
    <View style={styles.screenContainer}>
      <Header title="Convert to" onBack={onBack} />
      <View style={styles.sheet}>
        <Text style={styles.sheetTitle}>Choose output format</Text>
        <Text style={styles.sheetSubtitle}>Batch convert with smart compression</Text>

        {[
          { label: 'PNG', helper: 'Best for quality' }, { label: 'JPEG', helper: 'Smaller file size' }, { label: 'WebP', helper: 'Modern & efficient' }, ].map((opt) => (
          <TouchableOpacity key={opt.label} style={styles.optionCard} activeOpacity={0.9}>
            <Text style={styles.optionLabel}>{opt.label}</Text>
            <Text style={styles.optionHelper}>{opt.helper}</Text>
          </TouchableOpacity>
        ))}

        <View style={styles.progressCard}>
          <Text style={styles.progressTitle}>Converting 8 images…</Text>
          <View style={styles.progressTrack}>
            <View style={styles.progressFill} />
          </View>
          <Text style={styles.progressMeta}>Est. 3s</Text>
        </View>

        <PrimaryButton label="Done" onPress={onDone} />
      </View>
    </View>
  );
};

const PDFMergeScreen = ({ onBack, onMerge }) => {
  const files = [
    { id: '1', name: 'Contract.pdf', pages: 4, size: '1.2 MB' }, { id: '2', name: 'Invoice_March.pdf', pages: 2, size: '560 KB' }, { id: '3', name: 'Notes.pdf', pages: 8, size: '2.1 MB' }, ];

  return (
    <View style={styles.screenContainer}>
      <Header title="PDF Weaver" onBack={onBack} />
      <ScrollView contentContainerStyle={styles.mergeList}>
        {files.map((file, index) => (
          <View key={file.id} style={styles.pdfCard}>
            <View style={styles.pdfThumb} />
            <View style={{ flex: 1 }}>
              <Text style={styles.pdfTitle}>{file.name}</Text>
              <Text style={styles.pdfMeta}>
                {file.pages} pages • {file.size}
              </Text>
              <Text style={styles.pdfHint}>Drag to reorder</Text>
            </View>
            <Text style={styles.dragHandle}>≡</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.bottomButtonsRow}>
        <PrimaryButton label="Add PDF" variant="secondary" onPress={() => {}} />
        <PrimaryButton label="Merge PDFs" onPress={onMerge} />
      </View>
    </View>
  );
};

const PDFSplitScreen = ({ onBack, onCreate }) => {
  const pages = Array.from({ length: 12 }).map((_, i) => ({ id: String(i + 1) }));
  const numColumns = 3;
  const screenWidth = Dimensions.get('window').width;
  const sidePadding = spacing.lg;
  const gap = spacing.sm;
  const cardWidth = (screenWidth - sidePadding * 2 - gap * (numColumns - 1)) / numColumns;

  const renderItem = ({ item, index }) => (
    <View
      style={[
        styles.pageGridItem, { width: cardWidth, height: cardWidth * 1.3 }, index % 2 === 0 && styles.pageGridItemSelected, ]}
    >
      <Text style={styles.pageNumber}>{item.id}</Text>
    </View>
  );

  return (
    <View style={styles.screenContainer}>
      <Header title="Split PDF" onBack={onBack} />
      <Text style={styles.sectionTitlePad}>Select pages to include</Text>
      <FlatList
        data={pages}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        columnWrapperStyle={{ gap }}
        contentContainerStyle={{
          paddingHorizontal: sidePadding, paddingTop: spacing.md, paddingBottom: 100, gap, }}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
      <View style={styles.bottomButtonsRow}>
        <PrimaryButton label="Range 3–10" variant="secondary" onPress={() => {}} />
        <PrimaryButton label="Create PDF" onPress={onCreate} />
      </View>
    </View>
  );
};

const QuickCompressPickerScreen = ({ onBack, onNext }) => {
  return (
    <View style={styles.screenContainer}>
      <Header title="QuickCompress" onBack={onBack} />
      <Text style={styles.sectionTitlePad}>Choose images to optimize</Text>
      <View style={styles.placeholderBox}>
        <Text style={styles.previewText}>Image grid placeholder</Text>
      </View>
      <View style={styles.bottomBarSolid}>
        <Text style={styles.bottomInfo}>Selected: 5</Text>
        <PrimaryButton label="Next" onPress={onNext} />
      </View>
    </View>
  );
};

const QuickCompressSliderScreen = ({ onBack, onCompress }) => {
  return (
    <View style={styles.screenContainer}>
      <Header title="QuickCompress" onBack={onBack} />
      <View style={styles.reviewContent}>
        <View style={styles.sizeCard}>
          <View style={styles.sizeColumn}>
            <Text style={styles.sizeLabel}>Current</Text>
            <Text style={styles.sizeValue}>18.2 MB</Text>
          </View>
