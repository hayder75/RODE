import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../../axiosInstance'; // Adjust path as necessary

const TestScreen = ({ route, navigation }) => {
    const { subject, year, id, stream, feedbackType } = route.params;
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [explanation, setExplanation] = useState('');
    const [score, setScore] = useState(null);
    const [showScoreModal, setShowScoreModal] = useState(false);
    const [showQuestionListModal, setShowQuestionListModal] = useState(false);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await axiosInstance.get('/questionslist', { params: { subject, year } });
                setQuestions(response.data);
            } catch (error) {
                console.error('Error fetching questions:', error);
            }
        };

        const fetchStoredProgress = async () => {
            try {
                const storedAnswers = await AsyncStorage.getItem(`answers_${id}_${subject}_${year}`);
                if (storedAnswers) {
                    setAnswers(JSON.parse(storedAnswers));
                }
            } catch (error) {
                console.error('Error fetching stored progress:', error);
            }
        };

        fetchQuestions();
        fetchStoredProgress();
    }, [subject, year]);

    const saveAnswersToStorage = async (updatedAnswers) => {
        try {
            await AsyncStorage.setItem(`answers_${id}_${subject}_${year}`, JSON.stringify(updatedAnswers));
        } catch (error) {
            console.error('Error saving answers to storage:', error);
        }
    };

    const handleAnswerChange = (questionId, answer) => {
        const updatedAnswers = { ...answers, [questionId]: answer };
        setAnswers(updatedAnswers);
        saveAnswersToStorage(updatedAnswers);

        if (feedbackType === 'immediate') {
            const currentQuestion = questions[currentQuestionIndex];
            const isCorrect = currentQuestion.correctAnswer === answer;
            setExplanation(isCorrect ? '' : currentQuestion.explanation);
        } else {
            setExplanation('');
        }
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
            setExplanation('');
        }
    };

    const handleJumpToQuestion = (index) => {
        setCurrentQuestionIndex(index);
        setShowQuestionListModal(false);
        setExplanation('');
    };

    const handleExitSession = async () => {
        try {
            await AsyncStorage.removeItem(`answers_${id}_${subject}_${year}`);
            navigation.navigate('Homescreen');
        } catch (error) {
            console.error('Error clearing progress:', error);
            Alert.alert('Error', 'Failed to clear progress. Please try again.');
        }
    };

    const handleSubmit = async () => {
        try {
            const attemptData = Object.keys(answers).map((qId) => {
                const question = questions.find((q) => q._id === qId);
                return {
                    questionId: qId,
                    userAnswer: answers[qId],
                    isCorrect: question.correctAnswer === answers[qId],
                };
            });
    
            console.log('Submitting attempt data:', {
                userId: id,
                subject,
                year,
                stream,
                questions: attemptData,
            });
    
            const response = await axiosInstance.post('/test-attempts', {
                userId: id,
                subject,
                year,
                stream,
                questions: attemptData,
            });
    
            setScore(response.data.score);
            setShowScoreModal(true);
            await AsyncStorage.removeItem(`answers_${id}_${subject}_${year}`);
        } catch (error) {
            console.error('Error submitting test:', error);
            Alert.alert('Error', 'Failed to submit the test. Please try again.');
        }
    };
    
    if (!questions.length) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}> Test for {subject} - Year {year} </Text>
            <View style={styles.questionContainer}>
                <Text style={styles.questionText}>{currentQuestion.questionText}</Text>
                {currentQuestion.options.map((option) => (
                    <TouchableOpacity
                        key={option._id}
                        style={[
                            styles.optionButton,
                            answers[currentQuestion._id] === option.optionText
                                ? styles.selectedOption
                                : styles.unselectedOption,
                            feedbackType === 'immediate' &&
                                answers[currentQuestion._id] &&
                                currentQuestion.correctAnswer !== answers[currentQuestion._id] &&
                                option.optionText === currentQuestion.correctAnswer
                                ? styles.correctAnswer
                                : null,
                        ]}
                        onPress={() => handleAnswerChange(currentQuestion._id, option.optionText)}
                    >
                        <Text style={styles.optionText}>{option.optionText}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {explanation && <Text style={styles.explanationText}>{explanation}</Text>}

            <View style={styles.navigationButtons}>
                {currentQuestionIndex > 0 && (
                    <TouchableOpacity
                        style={styles.navButton}
                        onPress={() => handleJumpToQuestion(currentQuestionIndex - 1)}
                    >
                        <Text style={styles.navButtonText}>Prev</Text>
                    </TouchableOpacity>
                )}
                {currentQuestionIndex < questions.length - 1 ? (
                    <TouchableOpacity style={styles.navButton} onPress={handleNextQuestion}>
                        <Text style={styles.navButtonText}>Next</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={styles.navButton} onPress={handleSubmit}>
                        <Text style={styles.navButtonText}>Submit</Text>
                    </TouchableOpacity>
                )}
            </View>

            <TouchableOpacity
                style={styles.jumpButton}
                onPress={() => setShowQuestionListModal(true)}
            >
                <Text style={styles.jumpButtonText}>Jump to Question</Text>
            </TouchableOpacity>

            <Modal
                visible={showScoreModal}
                transparent={true}
                onRequestClose={() => setShowScoreModal(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>Your Score: {score}</Text>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => setShowScoreModal(false)}
                        >
                            <Text style={styles.modalButtonText}>Got it</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Modal
                visible={showQuestionListModal}
                transparent={true}
                onRequestClose={() => setShowQuestionListModal(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>Jump to Question</Text>
                        <FlatList
                            data={questions}
                            keyExtractor={(item) => item._id}
                            numColumns={5}
                            renderItem={({ item, index }) => (
                                <TouchableOpacity
                                    key={item._id}
                                    style={[
                                        styles.questionButton,
                                        answers[item._id]
                                            ? styles.answeredQuestion
                                            : styles.unansweredQuestion,
                                        answers[item._id] &&
                                        item.correctAnswer !== answers[item._id] &&
                                        styles.incorrectAnswer,
                                    ]}
                                    onPress={() => handleJumpToQuestion(index)}
                                >
                                    <Text style={styles.questionButtonText}>{index + 1}</Text>
                                </TouchableOpacity>
                            )}
                        />
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => setShowQuestionListModal(false)}
                        >
                            <Text style={styles.modalButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <TouchableOpacity style={styles.exitButton}
                onPress={handleExitSession}>
                <Text style={styles.exitButtonText}>Exit</Text>
            </TouchableOpacity>
        </View>);
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        padding: 16,
    },
    headerText: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
    },
    questionContainer: {
        marginBottom: 16,
    },
    questionText: {
        fontSize: 20,
        fontWeight: '500',
        marginBottom: 16,
    },
    optionButton: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
    },
    selectedOption: {
        backgroundColor: '#4CAF50',
        borderColor: '#4CAF50',
    },
    unselectedOption: {
        backgroundColor: '#fff',
    },
    optionText: {
        fontSize: 16,
    },
    explanationText: {
        color: '#d9534f',
        fontSize: 14,
        marginTop: 8,
    },
    navigationButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
    },
    navButton: {
        backgroundColor: '#007bff',
        padding: 12,
        borderRadius: 8,
        minWidth: 80,
    },
    navButtonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
    jumpButton: {
        backgroundColor: '#007bff',
        padding: 12,
        borderRadius: 8,
        marginTop: 16,
    },
    jumpButtonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    }, 
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalText: {
        fontSize: 18,
        marginVertical: 10,
    },
    modalButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
    },
    modalButtonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
    questionButton: {
        margin: 5,
        padding: 12,
        borderWidth: 1,
        borderColor: '#1F2937',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    questionButtonText: {
        fontSize: 16,
        color: '#1F2937',
        textAlign: 'center',
    },
    answeredQuestion: {
        backgroundColor: '#bfdbfe',
    },
    unansweredQuestion: {
        backgroundColor: '#ffffff',
    },
    incorrectAnswer: {
        backgroundColor: '#fca5a5',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    loadingText: {
        fontSize: 18,
        color: '#6c757d',
    },
    correctAnswer: {
        backgroundColor: '#28a745',
    },
    exitButton: {
        backgroundColor: '#dc3545',
        padding: 12,
        borderRadius: 8,
        marginTop: 16,
    },
    exitButtonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
});

export default TestScreen;
