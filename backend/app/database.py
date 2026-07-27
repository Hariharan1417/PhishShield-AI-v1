import sqlite3
from pathlib import Path

DB_PATH = (
    Path(__file__).resolve().parents[2]
    / "database"
    / "scan_history.db"
)


def get_connection():
    return sqlite3.connect(DB_PATH)


def create_table():

    conn = get_connection()

    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS scan_history (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        url TEXT,

        status TEXT,

        riskScore INTEGER,

        source TEXT,

        scanTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP

    )
    """)

    conn.commit()

    conn.close()