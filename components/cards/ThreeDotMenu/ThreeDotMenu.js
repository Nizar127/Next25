import React, { useState } from 'react';
import { Menu, IconButton } from '@gluestack-ui/themed';
import { MoreVertical, Repeat, Clock, Flag, Share2, Bell } from 'lucide-react-native';
import ImpressionModal from './ImpressionModal';
import FollowUpModal from './FollowUpModal';
import HistoryModal from './HistoryModal';
import ReportModal from './ReportModal';

const ThreeDotMenu = ({ pitch }) => {
  const [visibleModal, setVisibleModal] = useState(null);

  const handleAction = (action) => {
    // Log stateless action to Firestore
    logActionToFirestore(action, pitch.id);
    setVisibleModal(action);
  };

  const logActionToFirestore = async (action, pitchId) => {
    const { getFirestore, collection, addDoc } = require('firebase/firestore');
    const db = getFirestore();
    await addDoc(collection(db, 'actionLogs'), {
      action,
      pitchId,
      timestamp: new Date().toISOString(),
      userId: auth.currentUser?.uid
    });
  };

  return (
    <>
      <Menu
        placement="bottom right"
        trigger={({ ...triggerProps }) => (
          <IconButton
            {...triggerProps}
            icon={<MoreVertical size={20} />}
            variant="ghost"
          />
        )}
      >
        <Menu.Item onPress={() => handleAction('impression')}>
          <HStack space="md" alignItems="center">
            <Repeat size={16} />
            <Text>Impression (Repost)</Text>
          </HStack>
        </Menu.Item>
        <Menu.Item onPress={() => handleAction('followUp')}>
          <HStack space="md" alignItems="center">
            <Bell size={16} />
            <Text>Follow Up</Text>
          </HStack>
        </Menu.Item>
        <Menu.Item onPress={() => handleAction('history')}>
          <HStack space="md" alignItems="center">
            <Clock size={16} />
            <Text>History</Text>
          </HStack>
        </Menu.Item>
        <Menu.Item onPress={() => handleAction('report')}>
          <HStack space="md" alignItems="center">
            <Flag size={16} />
            <Text>Report</Text>
          </HStack>
        </Menu.Item>
        <Menu.Item onPress={() => handleAction('share')}>
          <HStack space="md" alignItems="center">
            <Share2 size={16} />
            <Text>Share</Text>
          </HStack>
        </Menu.Item>
      </Menu>

      {/* Modals */}
      <ImpressionModal 
        visible={visibleModal === 'impression'} 
        onClose={() => setVisibleModal(null)}
        pitch={pitch}
      />
      <FollowUpModal
        visible={visibleModal === 'followUp'}
        onClose={() => setVisibleModal(null)}
        pitch={pitch}
      />
      <HistoryModal
        visible={visibleModal === 'history'}
        onClose={() => setVisibleModal(null)}
        pitch={pitch}
      />
      <ReportModal
        visible={visibleModal === 'report'}
        onClose={() => setVisibleModal(null)}
        pitch={pitch}
      />
    </>
  );
};