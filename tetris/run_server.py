#!/usr/bin/env python3
"""
简单的HTTP服务器来运行俄罗斯方块游戏
解决文件协议下ES模块导入问题
"""

import http.server
import socketserver
import os
import webbrowser
import sys

class CORSRequestHandler(http.server.SimpleHTTPRequestHandler):
    """支持CORS的HTTP请求处理器"""
    
    def end_headers(self):
        # 添加CORS头
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()
    
    def translate_path(self, path):
        """将URL路径转换为文件系统路径"""
        # 移除查询参数
        if '?' in path:
            path = path.split('?', 1)[0]
        
        # 默认提供index.html
        if path == '/':
            path = '/index.html'
        
        # 转换为文件系统路径
        return super().translate_path(path)

def main():
    # 获取当前目录
    current_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(current_dir)
    
    # 设置端口
    PORT = 8000
    
    # 创建HTTP服务器
    handler = CORSRequestHandler
    handler.extensions_map = {
        '.html': 'text/html',
        '.js': 'application/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.svg': 'image/svg+xml',
        '.ico': 'image/x-icon',
        '.mp3': 'audio/mpeg',
        '.wav': 'audio/wav',
        '': 'application/octet-stream',  # 默认
    }
    
    try:
        with socketserver.TCPServer(("", PORT), handler) as httpd:
            print(f"服务器启动在 http://localhost:{PORT}")
            print(f"游戏地址: http://localhost:{PORT}/index.html")
            print(f"测试地址: http://localhost:{PORT}/test-game.html")
            print(f"简单版本: http://localhost:{PORT}/index-simple.html")
            print("按 Ctrl+C 停止服务器")
            
            # 自动在浏览器中打开
            try:
                webbrowser.open(f'http://localhost:{PORT}/index.html')
                print("已在浏览器中打开游戏页面")
            except:
                print("无法自动打开浏览器，请手动访问上面的URL")
            
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n服务器已停止")
        sys.exit(0)
    except OSError as e:
        print(f"启动服务器失败: {e}")
        print("请尝试使用其他端口，例如: python run_server.py 8080")
        sys.exit(1)

if __name__ == '__main__':
    # 检查是否有自定义端口参数
    if len(sys.argv) > 1:
        try:
            PORT = int(sys.argv[1])
        except ValueError:
            print("错误: 端口号必须是数字")
            sys.exit(1)
    else:
        PORT = 8000
    
    main()