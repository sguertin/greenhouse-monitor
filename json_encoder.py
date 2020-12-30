import datetime


def default_json_encoder(o):
    """[summary]
        Default encoder that provides encoder for datetime objects
    Args:
        o ([type]): the object to be encoded

    Returns:
        str: The isoformat of the datetime (if a datetime is passed)
    """
    if isinstance(o, (datetime.date, datetime.datetime)):
        return o.isoformat()
