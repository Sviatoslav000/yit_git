import unittest
import json
from unittest.mock import patch, MagicMock
from main import app, get_last_record


class TestFlaskApp(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    @patch("sqlite3.connect")
    def test_get_last_record_success(self, mock_connect):
        """Тестує успішне отримання останнього запису з БД."""
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_connect.return_value = mock_conn
        mock_conn.cursor.return_value = mock_cursor
        mock_cursor.fetchone.return_value = (25.5, 1.2, 50, 0.02, "2025-03-30 12:00:00", "GenX")

        result = get_last_record()
        self.assertIsNotNone(result)
        self.assertEqual(result[0], 25.5)
        self.assertEqual(result[5], "GenX")
        mock_conn.close.assert_called_once()

    @patch("main.get_last_record")
    def test_api_last_record_incomplete_data(self, mock_get_last_record):
        """Тестує API, коли дані неповні або некоректні."""
        # Моковані дані з бази: відсутнє поле 'temperature'
        mock_get_last_record.return_value = (None, 1.2, 50, 0.02, "2025-03-30 12:00:00", "GenX")
        response = self.app.get("/api/last_record")
        # Перевірка статус коду відповіді (має бути 400 або інший статус помилки)
        self.assertEqual(response.status_code, 400)
        # Перевірка наявності відповідної помилки в JSON відповіді
        data = json.loads(response.data)
        self.assertIn("error", data)
        self.assertEqual(data["error"], "Incomplete data received")

    @patch("main.get_last_record")
    def test_api_last_record_success(self, mock_get_last_record):
        """Тестує API, коли є дані в БД."""
        mock_get_last_record.return_value = (25.5, 1.2, 50, 0.02, "2025-03-30 12:00:00", "GenX")
        response = self.app.get("/api/last_record")
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        # Перевірка конкретних значеннь
        self.assertEqual(data["temperature"], 25.5)
        self.assertEqual(data["generator_name"], "GenX")


    @patch("main.get_last_record")
    def test_api_last_record_no_data(self, mock_get_last_record):
        """Тестує API, коли записів у БД немає."""
        mock_get_last_record.return_value = None
        response = self.app.get("/api/last_record")
        self.assertEqual(response.status_code, 404)
        data = json.loads(response.data)
        # Перевірка, чи міститься очікувана помилка
        self.assertEqual(data["error"], "No records found")

    def test_index_route(self):
        """Тестує головну сторінку."""
        response = self.app.get("/")
        self.assertEqual(response.status_code, 200)
        self.assertIn(b"<!DOCTYPE html>", response.data)

    def test_events_route(self):
        """Тестує сторінку подій."""
        response = self.app.get("/events")
        self.assertEqual(response.status_code, 200)
        self.assertIn(b"<!DOCTYPE html>", response.data)


if __name__ == "__main__":
    unittest.main()
