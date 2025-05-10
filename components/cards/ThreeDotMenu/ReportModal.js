const ReportModal = ({ visible, onClose, pitch }) => {
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);
  
    const handleSubmit = async () => {
      setLoading(true);
      try {
        // Stateful report tracking
        const db = getDatabase();
        const reportRef = ref(db, `reports/${pitch.id}/${auth.currentUser.uid}`);
        await set(reportRef, {
          reason,
          timestamp: Date.now()
        });
  
        // Stateless log
        const { getFirestore, collection, addDoc } = require('firebase/firestore');
        await addDoc(collection(getFirestore(), 'reportLogs'), {
          reporterId: auth.currentUser.uid,
          pitchId: pitch.id,
          reason,
          action: 'report',
          timestamp: new Date().toISOString()
        });
  
        onClose();
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <Modal isOpen={visible} onClose={onClose}>
        <Box p={4}>
          <Text fontSize="lg" mb={4}>Report this pitch</Text>
          <TextArea 
            placeholder="Reason for reporting..."
            value={reason}
            onChangeText={setReason}
            mb={4}
          />
          <Button onPress={handleSubmit} isLoading={loading}>
            <Text>Submit Report</Text>
          </Button>
        </Box>
      </Modal>
    );
  };