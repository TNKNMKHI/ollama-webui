import { ChakraProvider, Container, VStack, Input, Button, Box, Text, extendTheme } from '@chakra-ui/react';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { ModelSelector } from './components/ModelSelector';
import { ollamaApi } from './services/ollamaApi';

// テーマの設定
const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
});

function App() {
  const [selectedModel, setSelectedModel] = useState('');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!selectedModel) {
      alert('モデルを選択してください');
      return;
    }

    if (!input.trim()) return;

    setIsLoading(true);
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      console.log('メッセージ送信:', { model: selectedModel, input });  // デバッグ用
      const response = await ollamaApi.generateResponse(selectedModel, input);
      
      console.log('応答受信:', response);  // デバッグ用
      
      if (response && response.response) {
        const aiMessage = { 
          role: 'assistant', 
          content: response.response
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('エラー詳細:', error);
      const errorMessage = {
        role: 'assistant',
        content: `エラーが発生しました: ${error.message}`
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChakraProvider theme={theme}>
      <Container maxW="container.md" py={8}>
        <VStack spacing={6}>
          <ModelSelector onModelSelect={setSelectedModel} />
          
          {/* チャット履歴 */}
          <Box 
            w="100%" 
            h="400px" 
            overflowY="auto" 
            borderWidth={1} 
            borderRadius="lg" 
            p={4}
          >
            {messages.map((message, index) => (
              <Box 
                key={index}
                bg={message.role === 'user' ? 'blue.50' : 'gray.50'}
                p={3}
                my={2}
                borderRadius="md"
              >
                {message.content.split(/<think>|<\/think>/).map((part, i) => (
                  i % 2 === 0 ? (
                    <ReactMarkdown key={i}>
                      {part}
                    </ReactMarkdown>
                  ) : (
                    <Box
                      key={i}
                      borderWidth="1px"
                      borderColor="gray.200"
                      bg="white"
                      p={3}
                      my={2}
                      borderRadius="md"
                    >
                      <ReactMarkdown>
                        {part}
                      </ReactMarkdown>
                    </Box>
                  )
                ))}
              </Box>
            ))}
          </Box>

          {/* 入力フォーム */}
          <VStack w="100%" spacing={4}>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="メッセージを入力..."
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button 
              onClick={handleSendMessage} 
              colorScheme="blue" 
              isLoading={isLoading}
              w="100%"
            >
              送信
            </Button>
          </VStack>
        </VStack>
      </Container>
    </ChakraProvider>
  );
}

export default App;
