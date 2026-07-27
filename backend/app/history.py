from .database import get_connection


def save_scan(url, status, riskScore, source):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO scan_history (url, status, riskScore, source)
        VALUES (?, ?, ?, ?)
        """,
        (url, status, riskScore, source),
    )

    conn.commit()
    conn.close()


def get_history():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT
            id,
            url,
            status,
            riskScore,
            source,
            scanTime
        FROM scan_history
        ORDER BY id DESC
        LIMIT 50
        """
    )

    rows = cursor.fetchall()
    conn.close()

    return rows


def get_stats():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM scan_history")
    total = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM scan_history WHERE status='Safe'")
    safe = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM scan_history WHERE status='Suspicious'")
    suspicious = cursor.fetchone()[0]

    cursor.execute(
        """
        SELECT COUNT(*)
        FROM scan_history
        WHERE status='Phishing'
           OR status='High Risk'
        """
    )
    phishing = cursor.fetchone()[0]

    conn.close()

    return {
        "totalScans": total,
        "safe": safe,
        "suspicious": suspicious,
        "phishing": phishing,
    }


def clear_history():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM scan_history")

    conn.commit()
    conn.close()

    return {"message": "History cleared successfully"}


# NEW: Delete single history record
def delete_history_item(record_id):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "DELETE FROM scan_history WHERE id = ?",
        (record_id,),
    )

    conn.commit()
    deleted = cursor.rowcount
    conn.close()

    if deleted == 0:
        return {
            "success": False,
            "message": "History record not found."
        }

    return {
        "success": True,
        "message": "History record deleted successfully."
    }