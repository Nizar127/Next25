const HistoryModal = ({ visible, onClose, pitch }) => {
    const [versions, setVersions] = useState([]);
  
    useEffect(() => {
      const fetchHistory = async () => {
        const db = getDatabase();
        const historyRef = ref(db, `pitchHistory/${pitch.id}`);
        onValue(historyRef, (snapshot) => {
          setVersions(snapshot.val() ? Object.values(snapshot.val()) : []);
        });
      };
      
      if (visible) fetchHistory();
    }, [visible]);
  
    return (
      <Modal isOpen={visible} onClose={onClose} size="xl">
        <Box p={4}>
          <Text fontSize="xl" mb={4}>Version History</Text>
          <VStack space={2}>
            {versions.map((version, idx) => (
              <Pressable key={idx} onPress={() => console.log('View diff', version)}>
                <Box p={2} bg={idx === 0 ? 'blue.50' : undefined}>
                  <Text fontWeight={idx === 0 ? 'bold' : undefined}>
                    Version {versions.length - idx}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    {new Date(version.timestamp).toLocaleString()}
                  </Text>
                </Box>
              </Pressable>
            ))}
          </VStack>
        </Box>
      </Modal>
    );
  };